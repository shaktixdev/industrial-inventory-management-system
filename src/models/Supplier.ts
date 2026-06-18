import mongoose, { Schema, model, models } from "mongoose";

const SupplierSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, trim: true, uppercase: true },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    address: {
      line1: String,
      city: String,
      state: String,
      country: String,
      postalCode: String,
    },
    leadTimeDays: { type: Number, default: 7, min: 0 },
    rating: { type: Number, default: 3, min: 0, max: 5 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default models.Supplier || model("Supplier", SupplierSchema);
