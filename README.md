# Unit Pro

Vite + React site for Unit Pro gym, with a Node/Express + MySQL admin backend
(`server/`) for authentication and content management (subscriptions/pricing so
far; courses and clients are next).

## Run the frontend locally

```bash
npm install
npm run dev
```

## Run the admin backend locally

The backend is a separate app in `server/` with its own dependencies. You'll need
Docker (for MySQL) and Node.js.

```bash
# 1. Start MySQL (runs in Docker, port 3308)
docker compose up -d

# 2. Install and seed the backend
cd server
npm install
cp .env.example .env      # edit if you want different credentials
npm run seed              # creates roles/permissions, a super admin account, and
                           # the initial subscription plans (same content as the
                           # live site, now editable from the admin panel)

# 3. Run it
npm run dev                # http://localhost:4000
```

Then run the frontend as usual (`npm run dev` from the repo root). Make sure
`.env.local` at the repo root has `VITE_API_URL=http://localhost:4000/api` (copy
from `.env.example` if missing).

## Admin access

There's an admin panel for managing the site, reachable at **`/#/login`** (note:
it's a `HashRouter`, so the `#` is required — e.g.
`http://localhost:5173/#/login`). It's **not linked anywhere in the public
navigation** on purpose, so casual visitors won't stumble onto it. That said, this
is just "not advertised", not a real secret — it's a client-side React route like
any other, so don't rely on the URL alone for security. Actual protection is the
backend login/JWT check.

Two account types:
- **Super admin** — full access to everything, including creating/managing other
  admin accounts. One is created automatically by `npm run seed` in the backend,
  using the email/password from `server/.env` (`SUPER_ADMIN_EMAIL` /
  `SUPER_ADMIN_PASSWORD`). **Change that password after your first login** — there's
  no forced password-change flow yet.
- **Employee** — created by a super admin from the Employees page
  (`/#/admin/employees`), with a specific set of privileges chosen at creation time
  (e.g. "manage courses", "manage subscriptions"). Employees only see the parts of
  the admin panel they've been given access to.

Currently implemented:
- Login, session persistence, and employee/privilege management
- **Subscriptions & pricing** (`/#/admin/subscriptions`, requires the "manage
  subscriptions" privilege) — create, edit, reorder, and hide/show the membership
  plans, day pass, group class packages, personal training packages, and special
  offers shown on the public `/subscriptions` page.
- **Contact info** (`/#/admin/contact-info`, requires the "manage settings"
  privilege) — email, phone, WhatsApp number, hours, and location shown in the
  site footer.

The site and admin panel are French only (no language toggle) — one field to
fill in per fact, not two.

Course/class content editing and client management are planned next (see
`CLAUDE.md` for the full roadmap and architecture notes if you're picking up
development).

## Deploy to GitHub Pages

This project is configured for this repository:

- Repo: `https://github.com/bslreda26/unitpro`
- Live URL: `https://bslreda26.github.io/unitpro/`

Deploy steps:

```bash
npm install
npm run deploy
```

The deploy command builds the app and publishes the `dist` folder to the `gh-pages`
branch. Note: this only deploys the **frontend** — the backend (`server/`) isn't
hosted anywhere yet, so admin login won't work against the live site until that's
set up.

## GitHub Pages settings

In GitHub:

1. Open repository **Settings** -> **Pages**
2. Under **Build and deployment**, select **Deploy from a branch**
3. Branch: `gh-pages`, folder: `/ (root)`
4. Save
