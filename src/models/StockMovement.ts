import mongoose, { Schema, model, models } from "mongoose";
import { MOVEMENT_TYPES } from "@/types";

const StockMovementSchema = new Schema(
  {
    type: { type: String, enum: MOVEMENT_TYPES, required: true, index: true },
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true, index: true },
    quantity: { type: Number, required: true, min: 0.0001 },
    fromWarehouse: { type: Schema.Types.ObjectId, ref: "Warehouse" },
    toWarehouse: { type: Schema.Types.ObjectId, ref: "Warehouse" },
    unitCost: { type: Number, min: 0 },
    reference: { type: String, trim: true },
    reason: { type: String, trim: true },
    performedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

StockMovementSchema.index({ createdAt: -1 });
StockMovementSchema.index({ product: 1, createdAt: -1 });

export default models.StockMovement || model("StockMovement", StockMovementSchema);
