# Laravel + Next.js Auction (مزاد)

This repo is a simple auction demo:
- `backend/`: Laravel API (SQLite) — listings, bids, admin moderation
- `frontend/`: Next.js UI — browse listings, bid, submit a listing, admin review

## Run locally

### 1) Backend (Laravel)

```powershell
cd backend

# reset + seed sample data
php artisan migrate:fresh --seed

# (once) expose uploaded images (storage -> public/storage)
php artisan storage:link

# start API
php artisan serve --port=8000
```

Backend: `http://localhost:8000`

**Admin token**
- Set `ADMIN_TOKEN` in `backend/.env` (default is `change-me`).
- Admin endpoints require header `X-Admin-Token`.

**CORS**
- `CORS_ALLOWED_ORIGINS` in `backend/.env` (default: `http://localhost:3000`).

### 2) Frontend (Next.js)

```powershell
cd frontend

copy .env.local.example .env.local
npm install
npm run dev
```

Frontend: `http://localhost:3000`

## Main pages

- `/` browse approved listings
- `/listing/[slug]` listing details + bid
- `/sell` submit a new listing (pending admin approval)
- `/admin` review/approve/reject listings (needs `ADMIN_TOKEN`)

## API endpoints

Public:
- `GET /api/health`
- `GET /api/listings`
- `GET /api/listings/{slug}`
- `POST /api/listings` (submit listing)
- `POST /api/listings/{slug}/bids` (place bid)

Admin (header `X-Admin-Token`):
- `GET /api/admin/listings?status=pending|approved|rejected`
- `POST /api/admin/listings/{id}/approve`
- `POST /api/admin/listings/{id}/reject` (body: `{ "reason": "..." }`)

## Notes

- This is an auction demo only (no payments, no user accounts).
- Sample listings + bids are seeded via `Database\Seeders\ProductSeeder`.
