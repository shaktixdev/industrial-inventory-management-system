import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import PurchaseOrder from "@/models/PurchaseOrder";
import StockMovement from "@/models/StockMovement";
import { adjustStock } from "@/lib/inventory-service";
import { ok, fail, requireAuth, writeAudit } from "@/lib/api";

// Optional partial receipt: [{ product, quantity }]; if omitted, receive all outstanding.
const schema = z.object({
  receipts: z.array(z.object({ product: z.string(), quantity: z.number().positive() })).optional(),
});

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const auth = await requireAuth("OPERATOR");
  if (auth.response) return auth.response;
  await connectDB();

  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return fail("VALIDATION_ERROR", "Invalid receipt", 400, parsed.error.flatten());

  const po = await PurchaseOrder.findById(params.id);
  if (!po) return fail("NOT_FOUND", "PO not found", 404);
  if (po.status === "RECEIVED" || po.status === "CANCELLED")
    return fail("CONFLICT", `PO is ${po.status}`, 409);

  const requested = parsed.data.receipts;
  for (const line of po.lines as any[]) {
    const outstanding = line.quantity - (line.receivedQuantity || 0);
    if (outstanding <= 0) continue;
    let qty = outstanding;
    if (requested) {
      const r = requested.find((x) => x.product === line.product.toString());
      if (!r) continue;
      qty = Math.min(r.quantity, outstanding);
    }
    if (qty <= 0) continue;

    await adjustStock(line.product.toString(), po.warehouse.toString(), qty);
    await StockMovement.create({
      type: "IN",
      product: line.product,
      quantity: qty,
      toWarehouse: po.warehouse,
      unitCost: line.unitCost,
      reference: po.poNumber,
      performedBy: auth.user.id,
    });
    line.receivedQuantity = (line.receivedQuantity || 0) + qty;
  }

  const fullyReceived = (po.lines as any[]).every((l) => (l.receivedQuantity || 0) >= l.quantity);
  po.status = fullyReceived ? "RECEIVED" : "PARTIAL";
  await po.save();
  await writeAudit(auth.user.id, "po.receive", "purchaseorders", params.id,
    `Received goods for ${po.poNumber} -> ${po.status}`);

  return ok(po);
}
