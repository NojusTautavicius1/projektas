# Supabase Migration Steps (After Copilot Changes)

Follow these steps after backend code changes are done.

## 1. Prepare Supabase

1. Create a new Supabase project.
2. Open SQL Editor.
3. Run schema from [api/database-supabase.sql](api/database-supabase.sql).

## 2. Configure Backend Environment

Edit [api/.env](api/.env):

- `DB_DIALECT=postgres`
- `SUPABASE_DB_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`

Keep these values set correctly as well:

- `JWT_SECRET`
- `FRONTEND_URL`
- `EMAIL_USER`
- `EMAIL_PASSWORD`

## 3. Install and Run API

```bash
cd api
npm install
npm run dev
```

## 4. Validate Main Endpoints

Test these endpoints after startup:

- `GET /api/projects`
- `GET /api/content`
- `GET /api/services`
- `POST /api/contact`
- `GET /api/activity`

## 5. Optional Data Migration (MySQL -> Supabase)

1. Export data from current MySQL database.
2. Import data into Supabase tables created from [api/database-supabase.sql](api/database-supabase.sql).
3. Re-test auth and admin CRUD endpoints.

## 6. Production Switch

1. Point frontend and admin to the API deployment using Supabase-backed backend.
2. Verify login, content updates, project CRUD, and contact form flow in production.
