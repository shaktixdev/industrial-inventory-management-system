import { connectDB } from "@/lib/mongodb";
import Inventory from "@/models/Inventory";
import { ok, requireAuth, parsePagination } from "@/lib/api";

export async function GET(req: Request) {
  const auth = await requireAuth();
  if (auth.response) return auth.response;
  await connectDB();

  const { searchParams } = new URL(req.url);
  const { page, limit, skip } = parsePagination(searchParams);
  const warehouse = searchParams.get("warehouse");
  const lowStock = searchParams.get("lowStock") === "true";

  const query: Record<string, unknown> = {};
  if (warehouse) query.warehouse = warehouse;
  if (lowStock) query.$expr = { $lte: ["$quantityOnHand", "$reorderPoint"] };

  const [records, total] = await Promise.all([
    Inventory.find(query)
      .populate("product", "name sku unitOfMeasure unitCost reorderPoint")
      .populate("warehouse", "name code")
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean({ virtuals: true }),
    Inventory.countDocuments(query),
  ]);

  const data = records.map((r: any) => ({
    ...r,
    available: Math.max(0, (r.quantityOnHand || 0) - (r.reserved || 0)),
    lowStock: (r.quantityOnHand || 0) <= (r.reorderPoint || 0),
  }));

  return ok({ data, page, limit, total, totalPages: Math.ceil(total / limit) });
}
