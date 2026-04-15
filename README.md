# UnifiedAC

UnifiedAC is an AI-powered workflow audit platform that helps teams identify operational pain points, quantify opportunity, and generate governance-aware recommendations.

## Architecture Overview

This repository follows a monorepo layout with a backend service, frontend application, and Prisma data layer:

- **Frontend**: React + Vite SPA for dashboards, audit workflows, and recommendations.
- **Backend**: Node.js/TypeScript API for auth, audits, scoring, and reporting.
- **Database**: PostgreSQL with Prisma ORM for schema management, migrations, and seeding.
- **AI Integration**: OpenAI-backed recommendation generation and scoring utilities.

```text
unifiedac/
├─ backend/
│  ├─ prisma/
│  │  ├─ schema.prisma
│  │  └─ seed.ts
│  └─ src/
├─ frontend/
│  └─ src/
└─ README.md
```

## Install & Setup

1. **Clone and enter the repo**

   ```bash
   git clone <your-repo-url>
   cd unifiedac
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   ```bash
   cp .env.example .env
   ```

4. **Update credentials** in `.env`:
   - `DATABASE_URL`
   - `OPENAI_API_KEY`
   - `JWT_SECRET`
   - `FRONTEND_URL`, `BACKEND_URL`, and `API_BASE_URL`

## Database Migrations + Seed

Run Prisma migrations and seed demo data:

```bash
npx prisma migrate dev
npx prisma db seed --schema backend/prisma/schema.prisma
```

If your backend package defines scripts, you can also use:

```bash
npm run db:migrate
npm run db:seed
```

## Local Development

Run frontend and backend in watch mode:

```bash
npm run dev
```

Suggested local URLs:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:4000`

## Production Build

Build all apps:

```bash
npm run build
```

Start production backend (example):

```bash
npm run start
```

## Replit Run Instructions

1. Import this repository into Replit.
2. Add environment variables from `.env.example` in the Replit **Secrets** tab.
3. Run install:

   ```bash
   npm install
   ```

4. Run migrations + seed:

   ```bash
   npx prisma migrate deploy
   npx prisma db seed --schema backend/prisma/schema.prisma
   ```

5. Start app:

   ```bash
   npm run dev
   ```

If Replit requires a single command entrypoint, set it to:

```bash
npm install && npx prisma migrate deploy && npx prisma db seed --schema backend/prisma/schema.prisma && npm run dev
```

## Demo Credentials

Use the seeded demo user after running the seed script:

- **Email**: `demo@unifiedac.ai`
- **Password**: `demo123` (replace and hash securely for non-demo environments)

> Note: `backend/prisma/seed.ts` stores a placeholder password hash. Replace it with your own secure hash before shipping.
