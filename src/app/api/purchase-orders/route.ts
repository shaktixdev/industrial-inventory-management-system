import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import PurchaseOrder from "@/models/PurchaseOrder";
import { ok, fail, requireAuth, writeAudit, parsePagination } from "@/lib/api";
import { PO_STATUS } from "@/types";

const lineSchema = z.object({
  product: z.string().min(1),
  quantity: z.number().int().positive(),
  unitCost: z.number().min(0),
});

const schema = z.object({
  supplier: z.string().min(1),
  warehouse: z.string().min(1),
  lines: z.array(lineSchema).min(1),
  expectedDate: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(PO_STATUS).optional(),
});

export async function GET(req: Request) {
  const auth = await requireAuth();
  if (auth.response) return auth.response;
  await connectDB();
  const { searchParams } = new URL(req.url);
  const { page, limit, skip } = parsePagination(searchParams);
  const query: Record<string, unknown> = {};
  if (searchParams.get("status")) query.status = searchParams.get("status");

  const [data, total] = await Promise.all([
    PurchaseOrder.find(query)
      .populate("supplier", "name code")
      .populate("warehouse", "code name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    PurchaseOrder.countDocuments(query),
  ]);
  return ok({ data, page, limit, total, totalPages: Math.ceil(total / limit) });
}

export async function POST(req: Request) {
  const auth = await requireAuth("MANAGER");
  if (auth.response) return auth.response;
  await connectDB();
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return fail("VALIDATION_ERROR", "Invalid purchase order", 400, parsed.error.flatten());
  const po = await PurchaseOrder.create({ ...parsed.data, createdBy: auth.user.id });
  await writeAudit(auth.user.id, "po.create", "purchaseorders", po._id.toString(), `Created ${po.poNumber}`);
  return ok(po, 201);
}
