import { connectDB } from "@/lib/mongodb";
import PurchaseOrder from "@/models/PurchaseOrder";
import { ok, fail, requireAuth, writeAudit } from "@/lib/api";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const auth = await requireAuth();
  if (auth.response) return auth.response;
  await connectDB();
  const po = await PurchaseOrder.findById(params.id)
    .populate("supplier", "name code")
    .populate("warehouse", "code name")
    .populate("lines.product", "name sku")
    .lean();
  if (!po) return fail("NOT_FOUND", "PO not found", 404);
  return ok(po);
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const auth = await requireAuth("MANAGER");
  if (auth.response) return auth.response;
  await connectDB();
  const body = await req.json().catch(() => ({}));
  const po = await PurchaseOrder.findById(params.id);
  if (!po) return fail("NOT_FOUND", "PO not found", 404);
  if (po.status === "RECEIVED" && body.status === "DRAFT")
    return fail("CONFLICT", "Cannot move a received PO back to draft", 409);
  Object.assign(po, body);
  await po.save();
  await writeAudit(auth.user.id, "po.update", "purchaseorders", params.id, `Updated ${po.poNumber}`);
  return ok(po);
}
