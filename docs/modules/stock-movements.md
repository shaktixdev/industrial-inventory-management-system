# Module: Stock Movements (Ledger)

## Purpose
Immutable record of every stock change; the source of truth for inventory accuracy and audit.

## Data Model
`stockmovements` (type IN/OUT/TRANSFER/ADJUSTMENT, product, quantity, fromWarehouse, toWarehouse, unitCost, reference, reason, performedBy).

## API Surface
`GET /api/stock-movements` (filter product/type, paginated), `POST /api/stock-movements` (validates type-specific fields, updates inventory atomically).

## UI / Screens
- Movement ledger table (newest first) with type badges\n- New movement form switching fields by type\n- Filters by product/type/date

## RBAC
View: all. Create: OPERATOR+.

## Dependencies
Depends on: Products, Warehouses, Inventory.

## Acceptance Criteria
- IN requires toWarehouse; OUT requires fromWarehouse; TRANSFER requires both.\n- Inventory updated atomically with each movement.\n- Movements are never edited or deleted.
