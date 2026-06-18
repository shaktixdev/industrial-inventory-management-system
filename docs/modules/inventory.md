# Module: Inventory / Stock

## Purpose
Track on-hand, reserved and available quantities per product per warehouse, with reorder thresholds.

## Data Model
`inventory` (product, warehouse, bin, quantityOnHand, reserved, reorderPoint). Unique `{product,warehouse}`. Virtual `available`.

## API Surface
`GET /api/inventory` (filter by warehouse, lowStock), `GET /api/inventory/:id`. Quantities mutated only via stock movements (never edited directly).

## UI / Screens
- Stock table: product, warehouse, on-hand, reserved, available, status\n- Low-stock filter & highlight\n- Per-product stock breakdown across warehouses

## RBAC
View: all. Mutations occur via Stock Movements module only.

## Dependencies
Core: MongoDB connection, auth/RBAC, audit log.

## Acceptance Criteria
- `available = onHand - reserved` always consistent.\n- Low-stock = onHand <= reorderPoint.\n- No direct quantity edits via this module.
