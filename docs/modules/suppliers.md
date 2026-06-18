# Module: Suppliers

## Purpose
Maintain vendor master data and performance attributes for procurement.

## Data Model
`suppliers` (name, code unique, email, phone, address, leadTimeDays, rating, isActive).

## API Surface
`GET/POST /api/suppliers`, `PATCH /api/suppliers/:id`.

## UI / Screens
- Suppliers table with rating & lead time\n- Create/edit form

## RBAC
View: all. Create/edit: MANAGER+.

## Dependencies
Core: MongoDB connection, auth/RBAC, audit log.

## Acceptance Criteria
- Code uniqueness enforced.\n- Rating constrained 0-5.
