# Module: Warehouses

## Purpose
Model physical storage sites with zones and bin locations.

## Data Model
`warehouses` (code unique, name, address, zones:[{code,name,bins[]}], isActive).

## API Surface
`GET/POST /api/warehouses`, `GET/PATCH /api/warehouses/:id`.

## UI / Screens
- Warehouse cards/grid with capacity & active status\n- Detail view with zones & bins\n- Create/edit form

## RBAC
View: all. Create/edit: MANAGER+.

## Dependencies
Core: MongoDB connection, auth/RBAC, audit log.

## Acceptance Criteria
- Code uniqueness enforced.\n- Inventory references resolve to valid warehouses.
