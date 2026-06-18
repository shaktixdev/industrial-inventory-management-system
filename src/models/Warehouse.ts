import mongoose, { Schema, model, models } from "mongoose";

const AddressSchema = new Schema(
  {
    line1: String,
    city: String,
    state: String,
    country: String,
    postalCode: String,
  },
  { _id: false }
);

const ZoneSchema = new Schema(
  {
    code: { type: String, required: true },
    name: String,
    bins: { type: [String], default: [] },
  },
  { _id: false }
);

const WarehouseSchema = new Schema(
  {
    code: { type: String, required: true, unique: true, trim: true, uppercase: true },
    name: { type: String, required: true, trim: true },
    address: { type: AddressSchema, default: {} },
    zones: { type: [ZoneSchema], default: [] },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default models.Warehouse || model("Warehouse", WarehouseSchema);
