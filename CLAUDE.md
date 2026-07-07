# Unit Pro — Project Notes for Claude

## What this project is

Unit Pro is a gym website with two parts living in one repo:

1. **Frontend** (repo root): Vite + React 19 SPA, deployed statically to GitHub Pages
   (`https://bslreda26.github.io/unitpro/`, custom domain `www.unitpro.fit`). Uses
   `HashRouter` (so admin routes are `/#/login`, `/#/admin`, etc. — required because
   GitHub Pages can't do server-side rewrites for a history-mode router).
2. **Backend** (`server/`): Node.js + Express API, MVC-ish structure, MySQL via
   Sequelize. This is a **separate app** with its own `package.json`/`node_modules`,
   not part of the Vite build. It does not deploy anywhere yet — local only.

The frontend and backend are developed and run independently. The frontend calls the
backend over HTTP using `VITE_API_URL` (see `.env.local`).

## Status: Phases 1–2 done, phase 3 not started

The original ask was, in order:
1. ✅ **Admin authentication** — hidden `/login`, roles (super_admin / employee),
   super admin creates employees with specific privileges. **Done.**
2. ✅ **Subscriptions & pricing content** — admin can create/edit/reorder/hide the
   membership plans, day pass, group class packages, personal training packages,
   and special offers shown on the public `/subscriptions` page, bilingual (EN/FR).
   **Done.**
3. ⬜ **Course/class content editing** — same idea as phase 2 but for
   `src/data/groupClasses.js`. **Not started.**
4. ⬜ **Clients & subscriptions** — client records, client subscription management.
   **Not started.**

The `permissions` table (seeded in Phase 1) already has a `manage_courses` key
ready for phase 3, and `manage_clients` ready for phase 4, so no schema changes
will be needed there when those ship.

### Phase 2 notes (subscriptions & pricing)

- New table `subscription_plans` (`server/src/models/subscriptionPlan.model.js`)
  covers all five categories (`day_pass`, `membership`, `group_class`,
  `personal_training`, `special_offer`) in one table — they share the same shape,
  just with different fields populated per category. Bilingual text fields are
  separate columns (`nameEn`/`nameFr`, etc.); `features` is a single JSON column
  shaped `{ en: string[], fr: string[] }`.
- **Scope boundary, deliberately kept out of this phase**: page-level copy (section
  title "Choose your Package", tab labels, the WhatsApp CTA button text) is still
  static in `src/i18n/translations.js` — only the plan/package data itself is
  admin-editable. If asked to make tab labels or the section title editable too,
  that's new scope, not a bug.
- Public read: `GET /api/subscription-plans` (no auth, active plans only). Admin
  CRUD: `server/src/routes/adminSubscriptionPlan.routes.js`, mounted at
  `/api/admin/subscription-plans`, gated by `requirePermission('manage_subscriptions')`
  — reuses the exact same middleware from Phase 1, no new auth logic needed.
- `src/components/subscriptions/PricingPackagesSection.jsx` now fetches from the
  API and picks `nameEn`/`nameFr` etc. based on the current `lang` from
  `useI18n()`, instead of reading `dict.homePricing`. `src/pages/SubscriptionsPage.jsx`
  itself was untouched.
- Admin UI: `src/pages/admin/SubscriptionsPage.jsx` (careful: **not** the same file
  as the public `src/pages/SubscriptionsPage.jsx` — same name, different folder,
  easy to open the wrong one). One form handles create and edit (category picker,
  EN/FR fields side by side, features as a newline-separated textarea, sort order
  as a plain number field — no drag-and-drop, per an earlier scope decision).
- `seedSubscriptionPlans.js` migrated the exact EN/FR content that used to be
  hardcoded in `translations.js` (`dict.homePricing`) into the new table, so
  shipping this didn't change what visitors see. It's idempotent (checked by
  `planKey`), and folded into `npm run seed`.

## Language notes

- **Public site**: bilingual EN/FR via `useI18n()` (`src/i18n/I18nProvider.jsx`),
  toggled by the visitor. Defaults to **French** for any visitor without a saved
  preference, unless their browser explicitly prefers English
  (`navigator.language` starts with `en`) — changed from the original
  English-default behavior.
- **Admin panel** (`/login`, `/admin/*`): UI chrome (labels, buttons, table
  headers, confirm dialogs) is **hardcoded in French directly in the JSX** — it
  does **not** use `useI18n()`/`dict` at all, and there's no language toggle for
  admins. This was a deliberate choice (the gym's admins are French-speaking), not
  an oversight — don't "fix" it by wiring the admin panel into the public i18n
  system unless asked. The **data** the admin edits (subscription plan names,
  features, etc.) still has separate EN/FR fields, same as before, because that
  data feeds the bilingual public site.
- Permission labels (`permissions.label` in MySQL, shown in the Employees page's
  privilege checkboxes) are also stored in French now. If you ever need to
  UPDATE French text directly via `docker exec ... mysql -e "..."`, pass
  `--default-character-set=utf8mb4` — without it, accented characters get
  mangled into mojibake (`Gérer` → `GÃ©rer`) even though Sequelize/Node writes
  are unaffected. Hit this once already; check with a `SELECT` after any raw SQL
  UPDATE containing accents.

## Backend architecture (`server/`)

MVC-style, MySQL via Sequelize, JWT auth (Bearer token, not cookies — the SPA is on
a different origin than the API, so cookies would add cross-origin complexity for
no real benefit here).

```
server/
  server.js                 entry point: loads .env, connects DB, sequelize.sync(), listens
  src/
    config/database.js      Sequelize instance (env-driven)
    models/                 Role, Permission, User, UserPermission + associations (index.js)
    controllers/            auth.controller.js, user.controller.js, permission.controller.js
    routes/                 auth.routes.js, user.routes.js, permission.routes.js
    middlewares/
      auth.middleware.js     requireAuth (verifies JWT), requireRole, requirePermission
      errorHandler.js
    seeders/                seedRolesAndPermissions.js, seedSuperAdmin.js (idempotent, safe to re-run)
    utils/                  jwt.js, password.js (bcryptjs — pure JS, no native build step)
```

**Access control model**: `super_admin` bypasses all permission checks (implicit full
access). `employee` access is gated by rows in `user_permissions`, assigned
individually by the super admin at employee-creation time — there's no
role-level default permission set, every employee's privileges are explicit.

**Key endpoints**:
- `POST /api/auth/login` → `{email, password}` → `{token, user}`
- `GET /api/auth/me` → current user (used to restore session on page refresh)
- `GET/POST/PATCH/DELETE /api/admin/users` → employee CRUD, super_admin only
- `GET /api/permissions` → available privilege keys, for the create-employee form

## Frontend admin architecture

```
src/context/AuthContext.jsx        token+user in localStorage, login/logout, restores via /auth/me on load
src/api/client.js                  axios instance, attaches Authorization header
src/api/auth.api.js, users.api.js  API calls
src/components/admin/
  ProtectedRoute.jsx                redirects to /login if unauthenticated; requiredRole / requiredPermission props
  AdminLayout.jsx                   responsive sidebar/topbar shell (hamburger on mobile), logout
src/pages/admin/
  LoginPage.jsx                     sets a noindex meta tag on mount (see caveat below)
  AdminDashboardPage.jsx
  EmployeesPage.jsx                 super_admin only — create/list/disable/delete employees, assign privileges
```

Routing lives in `src/App.jsx` (decides whether to show the public Navbar/Footer —
skipped for `/login` and `/admin/*`) and `src/components/AnimatedRoutes.jsx` (actual
`<Route>` definitions). `/admin` uses nested routes with `AdminLayout` as the layout
route and `<Outlet />`.

**Important caveat**: `/login` is not linked in the public nav and gets a
`noindex, nofollow` meta tag, but this is **not a real security boundary** — it's a
client-rendered SPA, so the route and all its code ship in the same JS bundle as
everything else. Anyone who reads the bundle can find it. Actual security is the
backend JWT auth, not the URL being obscure. Don't oversell this to stakeholders as
"hidden".

## Local dev setup

```bash
# 1. MySQL (dedicated container for this project, port 3308 — a different,
#    unrelated project's MySQL container already uses 3307 on this machine)
docker compose up -d

# 2. Backend
cd server
npm install
npm run seed        # idempotent: creates roles, permissions, and the super admin
npm run dev         # nodemon, http://localhost:4000

# 3. Frontend (separate terminal, from repo root)
npm install
npm run dev         # Vite, http://localhost:5173 (or next free port if busy)
```

Super admin credentials are in `server/.env` (`SUPER_ADMIN_EMAIL` /
`SUPER_ADMIN_PASSWORD`, only used by the seeder — change the password after first
login, there's no "force password change" flow yet).

### Gotchas hit while building this (so we don't re-debug them)

- **`dotenv` treats an unquoted `#` as a comment start.** If a seeded/env password
  contains `#`, quote it: `SUPER_ADMIN_PASSWORD="UnitPro#Admin2026!"`. An unquoted
  value gets silently truncated at the `#` with no error — the seeder "succeeds"
  but the real password is shorter than you typed.
- **`nodemon` only watches `.js/.mjs/.cjs/.json` by default — not `.env`.** Editing
  `server/.env` (e.g. `CORS_ORIGINS`) does not trigger an auto-restart. Restart the
  backend manually after any `.env` change.
- **On this Windows setup, killing the backend's background dev-server task doesn't
  always kill the actual `node.exe`.** `npm run dev` → `nodemon` → `node server.js`
  is a process chain; stopping the top-level task can leave the `node.exe` grandchild
  still bound to port 4000, serving stale env values. If the backend seems to ignore
  a `.env`/code change after a restart, check `netstat -ano | grep :4000` and
  `taskkill //PID <pid> //F` the real listener before starting a new one.
- **CORS origin must match the frontend's actual port exactly.** Vite falls back to
  the next free port (5173 → 5174 → 5175…) if one's taken, and stray dev-server
  instances from earlier sessions are a common cause. `server/.env`'s
  `CORS_ORIGINS` lists several fallback ports for this reason — if you still get a
  CORS error, check the currently listed origin against Vite's actual output.
- **The login endpoint is rate-limited** (10 attempts / 15 min, in-memory). Repeated
  manual testing will trip it; restarting the backend clears it (in-memory store).

## Verification approach used for this phase

No `chromium-cli` available in this environment; used a throwaway Playwright script
(installed in a scratch dir, not committed) driving a real headless Chromium against
the running dev servers — login, employee creation with privilege assignment,
role-based UI gating (employee doesn't see the Employees nav item), and a mobile
viewport resize to confirm the hamburger menu. No project-level run/test skill exists
yet for this app; consider `/run-skill-generator` if this becomes a recurring need.
