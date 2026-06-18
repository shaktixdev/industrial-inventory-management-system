import mongoose, { Schema, model, models } from "mongoose";
import { PO_STATUS } from "@/types";

const POLineSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitCost: { type: Number, required: true, min: 0 },
    receivedQuantity: { type: Number, default: 0, min: 0 },
  },
  { _id: false }
);

const PurchaseOrderSchema = new Schema(
  {
    poNumber: { type: String, unique: true, index: true },
    supplier: { type: Schema.Types.ObjectId, ref: "Supplier", required: true },
    warehouse: { type: Schema.Types.ObjectId, ref: "Warehouse", required: true },
    status: { type: String, enum: PO_STATUS, default: "DRAFT", index: true },
    lines: { type: [POLineSchema], default: [] },
    expectedDate: { type: Date },
    notes: { type: String, trim: true },
    total: { type: Number, default: 0 },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// Auto-number POs and compute total before save
PurchaseOrderSchema.pre("save", async function (next) {
  if (this.isModified("lines")) {
    this.total = (this.lines as any[]).reduce(
      (sum, l) => sum + (l.quantity || 0) * (l.unitCost || 0),
      0
    );
  }
  if (!this.poNumber) {
    const count = await (this.constructor as any).countDocuments();
    this.poNumber = "PO-" + String(count + 1).padStart(6, "0");
  }
  next();
});

export default models.PurchaseOrder || model("PurchaseOrder", PurchaseOrderSchema);
