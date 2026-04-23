# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SmartEconomato is a full-stack web app for managing a school cafeteria: inventory (ingredientes, materiales), recipes (recetas), orders (pedidos), user management, and a real-time weight scale integration via serial port. The entire UI, database naming, and comments are in Spanish.

---

## Commands

### Run everything in development (from root)
```bash
npm run dev
```
This runs backend and frontend concurrently via `concurrently`.

### Backend only
```bash
cd EconomatoBack
npm run dev        # nodemon + ts-node
```

### Frontend only
```bash
cd EconomatoFront
npm run dev        # Vite dev server
npm run build      # tsc + vite build (production)
npm run lint       # ESLint
```

### Database
```bash
cd EconomatoBack
npm run db:setup          # db push --force-reset + seed (destructive)
npm run prisma:generate   # regenerate Prisma client after schema changes
npx prisma migrate dev    # create and apply a new migration
```

### Docker (production)
```bash
docker-compose up --build
```
Starts 4 services: `nginx` (443/80), `frontend` (80), `backend` (3002), `db` (PostgreSQL 5432).

---

## Architecture

### Stack
- **Backend:** Node 20 + Express 5 + TypeScript + Prisma (PostgreSQL) + Socket.io + SerialPort
- **Frontend:** React 19 + TypeScript + Vite + React Router 7 + Tailwind CSS 3 + Socket.io-client
- **Infra:** PostgreSQL 15, Nginx 1.27 (SSL reverse proxy), Docker Compose

### Request Flow (dev)
```
Browser → Vite dev server (proxy /api → localhost:3002) → Express → Prisma → PostgreSQL
                                                          ↕
                                                     Socket.io (scale data)
```

### Request Flow (production)
```
Browser → Nginx :443 → /api/* → backend:3002
                      → /*    → frontend:80 (nginx static)
```

---

## Backend (`EconomatoBack/`)

Entry point: `src/index.ts` — mounts 12 route modules at `/api/*`, initializes Socket.io, starts the scale serial port service.

### Route → Controller pattern
```
routes/ingredient.routes.ts  →  controllers/ingredient.controller.ts
```
Middleware order: `authenticateToken` → `requireRole([...])` → `schemaValidator(zodSchema)` → controller.

Zod validation schemas live in `src/schemas/`.

### Authentication
- JWT, 8h expiration, `Authorization: Bearer <token>` header.
- `src/middlewares/auth.middleware.ts` provides:
  - `authenticateToken()` — validates token, attaches user to `req.user`
  - `requireRole(allowedRoles[])` — role check with normalization (lowercase, no accents, no spaces)
- First login: `primer_login` flag on user; login returns `requiereCambioPass: true` instead of a token.
- Default password for new users: `Economato123`.

### Roles
`ALUMNO` · `PROFESOR` · `ADMINISTRADOR` (also referred to as `Jefe_Economato` in some checks). Role normalization is applied both in the backend middleware and in the frontend `hasRole()` — always use the same normalization when adding new role checks.

### Database naming conventions
- Tables and fields: `snake_case` in Spanish (`id_ingrediente`, `stock_minimo`, `precio_unidad`)
- Prisma model names match table names
- Enum values: PascalCase (`ENTRADA`, `SALIDA`, `AJUSTE`, `MERMA` for movements; `BORRADOR`, `PENDIENTE`, `VALIDADO`, `INCOMPLETO`, `CONFIRMADO`, `RECHAZADO` for orders)

### Real-time scale
`src/services/bascula.service.ts` opens COM1 at 9600 baud on app start, parses weight frames (STX/ETX delimited), and emits `peso_actualizado` via Socket.io to all connected clients.

### Required env vars (`EconomatoBack/.env`)
```
DATABASE_URL=postgresql://user:pass@host:5432/dbname?schema=public
JWT_SECRET=...
```

---

## Frontend (`EconomatoFront/`)

Entry: `src/App.tsx` wraps everything in `<AuthProvider>` and `<RouterProvider>`.

### Routing (`src/app/router.tsx`)
- Public: `/login`, `/cambiar-password`
- Protected (auth required): all other routes via `<ProtectedRoute>`
- Role-protected: `/admin-usuarios` via `<RoleProtectedRoute roles={["Administrador","Profesor"]}>`

### Auth state
`src/context/AuthContext.tsx` — stores the user object in `sessionStorage` (not `localStorage`; clears on tab close). Exposes `useAuth()` hook with `hasRole()`, `setUsuario()`, `logout()`.

All API calls go through `src/services/auth-service.ts` (`authFetch`) which automatically injects the Bearer token from sessionStorage.

### Service → Hook → Page pattern
```
services/inventarioService.ts   (API calls + data mapping)
  ↓
hooks/useInventarioManager.ts   (state, filters, derived data)
  ↓
pages/Inventario.tsx            (render only)
```
Follow this layering: services handle fetch + mapping to frontend models, hooks handle state and business logic, pages are mostly JSX.

### UI components (`src/components/ui/`)
- `Input` — `type: 'text'|'password'|'email'|'number'|'date'`, always returns string from `onChange`
- `Select` — controlled, `value`/`options`/`onChange`
- `Button` — `variant: 'primario'|'secundario'|'peligro'|'gris'`, supports `loading` prop

### Tailwind custom tokens
- `bg-acento` / `text-acento` — primary brand red
- `rounded-pill` — fully rounded corners
- `bg-input` — input background grey
- `animate-fade-in`, `animate-fade-in-up` — entry animations
- `scrollbar-global` — custom thin scrollbar

---

## Key domain models (frontend)

```typescript
// src/models/inventory.model.ts
InventarioItem { id, nombre, stock, stock_minimo, precio, unidad_medida,
                 id_categoria, categoria_nombre, id_proveedor, alergenos[] }

// src/models/resources.model.ts
Categoria { id_categoria, nombre }
Proveedor { id_proveedor, nombre }
Alergeno  { id_alergeno, nombre, icono }
```

---

## Prisma schema highlights

When modifying the schema (`EconomatoBack/prisma/schema.prisma`), run `npm run prisma:generate`. For production-safe changes use `prisma migrate dev`; use `db:setup` only in development (it resets the database).

Key many-to-many relationships:
- `ingrediente ↔ alergeno` (implicit join table)
- `receta ↔ ingrediente` via `receta_ingrediente` (with `cantidad` and `rendimiento`)
- `pedido ↔ ingrediente` via `pedido_ingrediente` (with `cantidad_pedida` and `cantidad_recibida`)
