# Module: Purchase Orders

## Purpose
Create and manage procurement orders with line items, approvals, and goods receipt.

## Data Model
`purchaseorders` (poNumber auto, supplier, warehouse, status, lines:[{product,quantity,unitCost,receivedQuantity}], expectedDate, total, createdBy).

## API Surface
`GET/POST /api/purchase-orders`, `GET/PATCH /api/purchase-orders/:id`, `POST /api/purchase-orders/:id/receive` (creates IN movements & updates inventory).

## UI / Screens
- PO list filtered by status\n- PO detail with line items & receive action\n- Status badges (DRAFT→SUBMITTED→APPROVED→PARTIAL→RECEIVED)

## RBAC
View: all. Create/edit: MANAGER+. Receive: OPERATOR+.

## Dependencies
Depends on: Suppliers, Products, Warehouses, Inventory, Stock Movements.

## Acceptance Criteria
- `total` auto-computed from lines.\n- Receiving updates inventory atomically and writes movements.\n- Status transitions validated (no RECEIVED→DRAFT).
