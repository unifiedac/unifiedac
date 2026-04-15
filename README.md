# unifiedac monorepo

This repository is structured as a Node.js workspace monorepo for a full-stack app:

- `frontend/` - Vite + React + TypeScript + Tailwind CSS
- `backend/` - Node + Express + TypeScript + Prisma + SQLite
- `shared/` - optional shared types/schemas between apps

## Prerequisites

- Node.js 20+
- npm 10+

## Install

```bash
npm install
```

## Workspace scripts

```bash
npm run dev            # run frontend + backend together
npm run dev:frontend   # run only frontend
npm run dev:backend    # run only backend
npm run build          # build frontend and backend
npm run migrate        # run prisma migrate dev in backend
npm run seed           # run prisma seed in backend
```

## Project structure

```text
.
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   └── src/
│       ├── controllers/
│       ├── lib/
│       ├── middleware/
│       ├── routes/
│       ├── services/
│       ├── utils/
│       ├── app.ts
│       ├── index.ts
│       └── server.ts
├── frontend/
│   ├── public/
│   └── src/
│       ├── api/
│       ├── components/
│       ├── features/
│       ├── hooks/
│       ├── pages/
│       ├── types/
│       ├── utils/
│       ├── App.tsx
│       ├── index.css
│       └── main.tsx
└── shared/
    └── src/
```
