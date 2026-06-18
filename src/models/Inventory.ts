import mongoose, { Schema, model, models } from "mongoose";

const InventorySchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true, index: true },
    warehouse: { type: Schema.Types.ObjectId, ref: "Warehouse", required: true, index: true },
    bin: { type: String, trim: true },
    quantityOnHand: { type: Number, default: 0, min: 0 },
    reserved: { type: Number, default: 0, min: 0 },
    reorderPoint: { type: Number, default: 0, min: 0 },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

InventorySchema.index({ product: 1, warehouse: 1 }, { unique: true });

InventorySchema.virtual("available").get(function () {
  return Math.max(0, (this.quantityOnHand ?? 0) - (this.reserved ?? 0));
});

export default models.Inventory || model("Inventory", InventorySchema);
