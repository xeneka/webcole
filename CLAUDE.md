# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Web platform for CEIP San Isidro school — a full-stack institutional site with a public-facing portal and a protected admin panel. Features: news/blog posts, document repository, interactive calendar, and full-screen popup alerts.

## Commands

### Backend

```bash
cd backend
source venv/bin/activate
uvicorn main:app --reload          # Dev server at http://localhost:8000
```

### Frontend

```bash
cd frontend
npm run dev -- --port 5173         # Dev server at http://localhost:5173
npm run build                      # Production build
npm run lint                       # ESLint
npm run preview                    # Preview production build
```

### Docker (local with PostgreSQL)

```bash
docker-compose -f docker-compose.local.yml up
# Backend: http://localhost:8000 | Frontend: http://localhost:8080
```

## Architecture

**Backend** follows hexagonal architecture:

- `app/domain/models.py` — Pydantic domain models
- `app/application/use_cases.py` — business logic (services)
- `app/infrastructure/database/` — SQLAlchemy models, DB connection, repository pattern
- `app/infrastructure/web/routes.py` — FastAPI route handlers
- `app/core/config.py` — settings and `DATABASE_URL`
- `app/core/security.py` — JWT (HS256, 7-day expiry) and bcrypt password hashing
- `main.py` — FastAPI app entry point, CORS, static file mounting

**Frontend** is a React SPA (Vite):

- `src/context/AuthContext.jsx` — JWT stored in `localStorage`, shared via React context
- `src/App.jsx` — root component with React Router routes
- `src/pages/` — one component per route (Home, News, Documents, CalendarScreen, Login)
- `src/components/` — shared UI (Navbar, Hero, PopupNotification)
- Vanilla CSS with CSS variables; dark mode supported natively
- In dev: Vite proxies `/api` and `/uploads` to `http://127.0.0.1:8000`

**Database:**
- Local: SQLite (`backend/colegio.db`)
- Production: PostgreSQL via `DATABASE_URL` env var (Pydantic auto-converts `postgres://` → `postgresql://`)
- Tables: `users`, `posts`, `documents`, `events`, `popup_settings`
- Default admin auto-created on first startup: `admin` / `admin123`

**API base path:** `/api/` — all routes are prefixed here. Public GET endpoints; write/update endpoints require `Authorization: Bearer <JWT>` header.

**File uploads:** stored in `backend/uploads/`, renamed with UUID, served at `/api/uploads/{filename}`.

## Deployment

Production target is **Easypanel**. The `docker-compose.yml` uses an external network (`easypanel_net`) instead of a local bridge — do not add an `internal_net` or other custom network that conflicts with Traefik. Backend uses `expose: 8000` (not `ports`) to avoid port conflicts. Frontend is Nginx on port 80, proxying `/api/` and `/uploads/` to the backend container.

## Known Issues / Constraints

- JWT secret key is hardcoded in `app/core/security.py` as `"super-secret-key-eduvision"` — treat as a known issue, do not expose further.
- No test suite exists in this project.
- CORS is open (`allow_origins=["*"]`) intentionally for development; production does not restrict origins either.
