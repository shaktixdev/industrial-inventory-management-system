export const ROLES = ["ADMIN", "MANAGER", "OPERATOR", "VIEWER"] as const;
export type Role = (typeof ROLES)[number];

// Role rank for hierarchy checks (higher = more privileges)
export const ROLE_RANK: Record<Role, number> = {
  VIEWER: 1,
  OPERATOR: 2,
  MANAGER: 3,
  ADMIN: 4,
};

export const PRODUCT_STATUS = ["ACTIVE", "INACTIVE", "DISCONTINUED"] as const;
export type ProductStatus = (typeof PRODUCT_STATUS)[number];

export const UNITS = ["EA", "KG", "G", "L", "ML", "M", "BOX", "PALLET"] as const;
export type UnitOfMeasure = (typeof UNITS)[number];

export const MOVEMENT_TYPES = ["IN", "OUT", "TRANSFER", "ADJUSTMENT"] as const;
export type MovementType = (typeof MOVEMENT_TYPES)[number];

export const PO_STATUS = [
  "DRAFT",
  "SUBMITTED",
  "APPROVED",
  "PARTIAL",
  "RECEIVED",
  "CANCELLED",
] as const;
export type POStatus = (typeof PO_STATUS)[number];

export interface Paginated<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
