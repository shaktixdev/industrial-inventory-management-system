# Module: Settings

## Purpose
Manage users, roles, and system configuration.

## Data Model
Operates on `users`; future `settings` collection for org-level config.

## API Surface
User management endpoints (ADMIN). Config endpoints in roadmap.

## UI / Screens
- Users table with role assignment & activate/deactivate\n- System settings panel (roadmap)

## RBAC
ADMIN only.

## Dependencies
Core: MongoDB connection, auth/RBAC, audit log.

## Acceptance Criteria
- Only ADMIN can change roles.\n- Deactivated users cannot sign in.
