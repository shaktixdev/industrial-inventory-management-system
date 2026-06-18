# Module: Reports & Analytics

## Purpose
Provide valuation, movement and low-stock reporting for decision making.

## Data Model
Aggregations over inventory & movements (no new collection).

## API Surface
Served via `/api/dashboard/stats` and dedicated report queries (extensible).

## UI / Screens
- Inventory valuation by warehouse/category\n- Movement volume over time\n- Low-stock & reorder suggestions\n- Export (roadmap)

## RBAC
View: all (typically MANAGER+ focus).

## Dependencies
Core: MongoDB connection, auth/RBAC, audit log.

## Acceptance Criteria
- Valuation = Σ onHand × unitCost.\n- Reports match underlying data.
