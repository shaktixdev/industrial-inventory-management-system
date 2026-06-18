import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import StockMovement from "@/models/StockMovement";
import Product from "@/models/Product";
import { adjustStock, getAvailable } from "@/lib/inventory-service";
import { ok, fail, requireAuth, writeAudit, parsePagination } from "@/lib/api";
import { MOVEMENT_TYPES } from "@/types";

const schema = z.object({
  type: z.enum(MOVEMENT_TYPES),
  product: z.string().min(1),
  quantity: z.number().positive(),
  fromWarehouse: z.string().optional(),
  toWarehouse: z.string().optional(),
  unitCost: z.number().min(0).optional(),
  reference: z.string().optional(),
  reason: z.string().optional(),
});

export async function GET(req: Request) {
  const auth = await requireAuth();
  if (auth.response) return auth.response;
  await connectDB();

  const { searchParams } = new URL(req.url);
  const { page, limit, skip } = parsePagination(searchParams);
  const query: Record<string, unknown> = {};
  if (searchParams.get("product")) query.product = searchParams.get("product");
  if (searchParams.get("type")) query.type = searchParams.get("type");

  const [data, total] = await Promise.all([
    StockMovement.find(query)
      .populate("product", "name sku")
      .populate("fromWarehouse", "code name")
      .populate("toWarehouse", "code name")
      .populate("performedBy", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    StockMovement.countDocuments(query),
  ]);

  return ok({ data, page, limit, total, totalPages: Math.ceil(total / limit) });
}

export async function POST(req: Request) {
  const auth = await requireAuth("OPERATOR");
  if (auth.response) return auth.response;
  await connectDB();

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return fail("VALIDATION_ERROR", "Invalid movement", 400, parsed.error.flatten());
  const m = parsed.data;

  // Type-specific validation
  if ((m.type === "IN" || m.type === "TRANSFER") && !m.toWarehouse)
    return fail("VALIDATION_ERROR", "toWarehouse is required for IN/TRANSFER", 400);
  if ((m.type === "OUT" || m.type === "TRANSFER") && !m.fromWarehouse)
    return fail("VALIDATION_ERROR", "fromWarehouse is required for OUT/TRANSFER", 400);

  const product = await Product.findById(m.product).lean<any>();
  if (!product) return fail("NOT_FOUND", "Product not found", 404);

  // Guard against negative stock for OUT / TRANSFER source
  if (m.type === "OUT" || m.type === "TRANSFER") {
    const available = await getAvailable(m.product, m.fromWarehouse!);
    if (available < m.quantity)
      return fail("CONFLICT", `Insufficient stock: ${available} available`, 409);
  }

  // Apply inventory side-effects
  if (m.type === "IN") {
    await adjustStock(m.product, m.toWarehouse!, m.quantity, product.reorderPoint);
  } else if (m.type === "OUT") {
    await adjustStock(m.product, m.fromWarehouse!, -m.quantity);
  } else if (m.type === "TRANSFER") {
    await adjustStock(m.product, m.fromWarehouse!, -m.quantity);
    await adjustStock(m.product, m.toWarehouse!, m.quantity, product.reorderPoint);
  } else if (m.type === "ADJUSTMENT") {
    // ADJUSTMENT sets a signed delta on the toWarehouse (positive) or fromWarehouse (negative)
    const wh = m.toWarehouse || m.fromWarehouse;
    if (!wh) return fail("VALIDATION_ERROR", "ADJUSTMENT requires a warehouse", 400);
    const sign = m.toWarehouse ? 1 : -1;
    await adjustStock(wh, wh === m.toWarehouse ? m.toWarehouse : m.fromWarehouse!, 0); // ensure record
    await adjustStock(m.product, wh, sign * m.quantity, product.reorderPoint);
  }

  const movement = await StockMovement.create({ ...m, performedBy: auth.user.id });
  await writeAudit(auth.user.id, "movement.create", "stockmovements", movement._id.toString(),
    `${m.type} ${m.quantity} of ${product.sku}`);

  return ok(movement, 201);
}
