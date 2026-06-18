import mongoose, { Schema, model, models } from "mongoose";
import { PRODUCT_STATUS, UNITS } from "@/types";

const ProductSchema = new Schema(
  {
    sku: { type: String, required: true, unique: true, trim: true, uppercase: true, index: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", index: true },
    unitOfMeasure: { type: String, enum: UNITS, default: "EA" },
    barcode: { type: String, trim: true, sparse: true, unique: true },
    unitCost: { type: Number, default: 0, min: 0 },
    unitPrice: { type: Number, default: 0, min: 0 },
    reorderPoint: { type: Number, default: 0, min: 0 },
    reorderQuantity: { type: Number, default: 0, min: 0 },
    status: { type: String, enum: PRODUCT_STATUS, default: "ACTIVE" },
    tags: { type: [String], default: [] },
  },
  { timestamps: true }
);

ProductSchema.index({ name: "text", sku: "text" });

export default models.Product || model("Product", ProductSchema);
