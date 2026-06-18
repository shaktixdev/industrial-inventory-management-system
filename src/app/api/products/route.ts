import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { ok, fail, requireAuth, writeAudit, parsePagination } from "@/lib/api";
import { PRODUCT_STATUS, UNITS } from "@/types";

const createSchema = z.object({
  sku: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  category: z.string().optional(),
  unitOfMeasure: z.enum(UNITS).optional(),
  barcode: z.string().optional(),
  unitCost: z.number().min(0).optional(),
  unitPrice: z.number().min(0).optional(),
  reorderPoint: z.number().min(0).optional(),
  reorderQuantity: z.number().min(0).optional(),
  status: z.enum(PRODUCT_STATUS).optional(),
  tags: z.array(z.string()).optional(),
});

export async function GET(req: Request) {
  const auth = await requireAuth();
  if (auth.response) return auth.response;
  await connectDB();

  const { searchParams } = new URL(req.url);
  const { page, limit, skip } = parsePagination(searchParams);
  const search = searchParams.get("search")?.trim();
  const category = searchParams.get("category");

  const query: Record<string, unknown> = {};
  if (search) query.$or = [
    { name: { $regex: search, $options: "i" } },
    { sku: { $regex: search, $options: "i" } },
  ];
  if (category) query.category = category;

  const [data, total] = await Promise.all([
    Product.find(query).populate("category", "name").sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Product.countDocuments(query),
  ]);

  return ok({ data, page, limit, total, totalPages: Math.ceil(total / limit) });
}

export async function POST(req: Request) {
  const auth = await requireAuth("MANAGER");
  if (auth.response) return auth.response;
  await connectDB();

  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return fail("VALIDATION_ERROR", "Invalid product", 400, parsed.error.flatten());

  try {
    const product = await Product.create(parsed.data);
    await writeAudit(auth.user.id, "product.create", "products", product._id.toString(), `Created product ${product.sku}`);
    return ok(product, 201);
  } catch (e: any) {
    if (e.code === 11000) return fail("CONFLICT", "SKU or barcode already exists", 409);
    return fail("SERVER_ERROR", e.message, 500);
  }
}
