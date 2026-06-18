# Module: Products / Catalog

## Purpose
Maintain the master catalog of items (SKUs) with pricing, UoM, barcodes and reorder policy.

## Data Model
`products` (sku unique, name, category, unitOfMeasure, barcode, unitCost, unitPrice, reorderPoint, reorderQuantity, status, tags).

## API Surface
`GET/POST /api/products`, `GET/PATCH/DELETE /api/products/:id`. Zod-validated. Search by name/sku, filter by category, paginated.

## UI / Screens
- Products table with search, category filter, status badge, pagination\n- Create/edit drawer or modal\n- Delete with confirmation (ADMIN)

## RBAC
View: all. Create/edit: MANAGER+. Delete: ADMIN.

## Dependencies
Core: MongoDB connection, auth/RBAC, audit log.

## Acceptance Criteria
- SKU uniqueness enforced (409 on duplicate).\n- Validation errors return 400 with field details.\n- Deleting a product warns if inventory exists.
