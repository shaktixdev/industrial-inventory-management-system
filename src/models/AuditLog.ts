import mongoose, { Schema, model, models } from "mongoose";

const AuditLogSchema = new Schema(
  {
    actor: { type: Schema.Types.ObjectId, ref: "User" },
    action: { type: String, required: true },
    entity: { type: String, required: true },
    entityId: { type: String },
    summary: { type: String },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

AuditLogSchema.index({ createdAt: -1 });

export default models.AuditLog || model("AuditLog", AuditLogSchema);
