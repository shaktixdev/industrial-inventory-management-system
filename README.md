# Industrial Inventory Management System (IIMS)

> An advanced, production-grade inventory & warehouse management platform for industrial operations — built with **Next.js 14 (App Router)**, **MongoDB / Mongoose**, **TypeScript** and **Tailwind CSS**.

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-green)](https://www.mongodb.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fshaktixdev%2Findustrial-inventory-management-system&env=MONGODB_URI,NEXTAUTH_SECRET,NEXTAUTH_URL&envDescription=MongoDB%20URI%2C%20NextAuth%20secret%20and%20deployed%20URL&envLink=https%3A%2F%2Fgithub.com%2Fshaktixdev%2Findustrial-inventory-management-system%2Fblob%2Fmain%2Fdocs%2FDEPLOYMENT.md)

Click the button, set the three environment variables when prompted, then run
`npm run seed` against your MongoDB once to create the admin user. Full guide:
[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

---

## Overview

IIMS gives industrial businesses real-time control over stock, multi-warehouse operations,
procurement, and movement traceability. It is designed for plants, distribution centers and
multi-site manufacturers that need accurate, auditable inventory data.

## Key Features

- **Multi-warehouse & bin-location** stock tracking
- **Real-time stock levels** with reorder points and low-stock alerts
- **Products / SKU catalog** with categories, units of measure, barcodes
- **Procurement** — suppliers, purchase orders, goods receipt
- **Stock movements** — inbound, outbound, transfers, adjustments (full audit trail)
- **Analytics dashboard** — KPIs, valuation, trends (Recharts)
- **Role-based access control** (Admin / Manager / Operator / Viewer)
- **Audit logging** for every mutating action
- **Modern, responsive UI** with dark mode

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router, Server Components, Route Handlers) |
| Language | TypeScript |
| Database | MongoDB + Mongoose ODM |
| Auth | NextAuth.js (credentials + JWT sessions) |
| UI | Tailwind CSS, custom component kit, lucide-react icons |
| Charts | Recharts |
| Validation | Zod |

## Documentation

| Doc | Purpose |
|-----|---------|
| [docs/RND.md](docs/RND.md) | Research & Development — problem, market, decisions |
| [docs/Design.md](docs/Design.md) | System architecture & design system |
| [docs/SCHEMA.md](docs/SCHEMA.md) | Complete data model & collections |
| [docs/API.md](docs/API.md) | REST API reference |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) | Deploy to Vercel / Docker / self-hosted |
| [docs/ROADMAP.md](docs/ROADMAP.md) | Phased delivery plan |
| [docs/modules/](docs/modules/) | One spec file per module |

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env.local
#    -> set MONGODB_URI and NEXTAUTH_SECRET

# 3. Seed an admin user + demo data
npm run seed

# 4. Run the dev server
npm run dev
# open http://localhost:3000
```

Default seed login: `admin@iims.local` / `ChangeMe123!` (override via `.env.local`).

## Project Structure

```
src/
  app/                 # App Router pages + API route handlers
    (dashboard)/       # Authenticated app shell + module pages
    api/               # REST endpoints (route handlers)
  components/          # UI kit + layout (sidebar, header)
  lib/                 # mongodb connection, auth, utils
  models/              # Mongoose schemas (data layer)
  types/               # Shared TypeScript types
docs/                  # Full documentation set
scripts/seed.ts        # Seed script
```

## License

MIT — see [LICENSE](LICENSE).
