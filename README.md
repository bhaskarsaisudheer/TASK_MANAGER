# Team Task Manager

Full-stack Team Task Management Web Application (projects, teams, tasks, dashboard) with:

- React (Vite) frontend (`apps/web`)
- Node.js + Express REST API (`apps/api`)
- Postgres database via Prisma
- JWT auth + role-based access (Admin/Member)

## Local setup

### 1) Install dependencies

```bash
npm install
```

### 2) Configure environment variables

Create `apps/api/.env`:

```bash
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DB"
JWT_SECRET="replace-me"
APP_ORIGIN="http://localhost:5173"
```

### 3) Sync DB schema (Prisma)

```bash
npm run prisma:migrate -w api
```

### 4) Run dev servers

API:

```bash
npm run dev -w api
```

Web:

```bash
npm run dev -w web
```

## Deployment (Railway)

Deploy the `apps/api` service (it serves the built web UI too). Set Railway environment variables:

- `DATABASE_URL`
- `JWT_SECRET`
- `APP_ORIGIN` (set to your deployed domain)

