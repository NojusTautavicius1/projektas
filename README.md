# Portfolio Project - Production Ready

## 🎯 Project Status: Ready for Production

This portfolio project has been audited and prepared for production deployment.

## 📁 Project Structure

```
projektas/
├── api/                    # Backend API (Node.js + Express)
├── front/                  # Frontend (React + Vite)
├── admin/                  # Admin Panel (React)
├── SECURITY.md            # Security checklist and guidelines
├── DEPLOYMENT.md          # Deployment instructions
├── security-check.sh      # Pre-deployment security script
└── .env.production.example # Production environment template
```

## 🔒 Security Status

### ✅ What's Secure:
- Environment variables properly configured
- `.env` file is in `.gitignore`
- No hardcoded passwords or secrets in code
- SQL injection protection (parameterized queries)
- Password hashing with bcryptjs
- JWT authentication
- Input validation and sanitization
- CORS configured for specific origins
- Admin role-based access control

### ⚠️ Important Notes:

**CRITICAL: Email Credentials Exposed**
- The `.env.example` file previously contained actual email credentials
- These have been removed, but if they were committed to Git history:
  - **Change the email password immediately**
  - Generate a new app-specific password
  - Consider rotating other secrets

## 🚀 Quick Start for Production

### 1. Security Check
```bash
chmod +x security-check.sh
./security-check.sh
```

### 2. Configure Environment
```bash
cd api
cp .env.example .env
# Edit .env with your production values
nano .env
```

### 3. Generate JWT Secret
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 4. Deploy
See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

## 📋 Pre-Deployment Checklist

Before deploying to production, ensure:

- [ ] Run `./security-check.sh` and fix all errors
- [ ] Generate strong JWT secret (64+ characters)
- [ ] Set strong database password (16+ characters)
- [ ] Update email credentials (if exposed)
- [ ] Configure production domain in CORS
- [ ] Set up HTTPS/SSL certificate
- [ ] Configure database backups
- [ ] Review all environment variables
- [ ] Test in staging environment first
- [ ] Run `npm audit` and fix vulnerabilities

## 🔐 Security Features

1. **Authentication**
   - JWT token-based authentication
   - Password hashing with bcryptjs
   - Email validation
   - Google OAuth support (optional)

2. **Authorization**
   - Role-based access control (admin/user)
   - Protected API endpoints
   - Middleware authentication

3. **Input Validation**
   - express-validator for all inputs
   - Input sanitization (XSS protection)
   - SQL injection prevention

4. **Database Security**
   - Parameterized queries only
   - Environment-based credentials
   - Connection pooling

5. **CORS Protection**
   - Specific origin whitelist
   - Credentials enabled only for trusted origins
   - Production/development separation

## 📚 Documentation

- [SECURITY.md](SECURITY.md) - Complete security checklist and best practices
- [DEPLOYMENT.md](DEPLOYMENT.md) - Step-by-step deployment guide
- [SUPABASE_MIGRATION_STEPS.md](SUPABASE_MIGRATION_STEPS.md) - Steps for switching backend database to Supabase Postgres
- `.env.production.example` - Production environment template

## 🛠️ Technologies

- **Backend**: Node.js, Express, MySQL
- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Authentication**: JWT, Passport.js
- **Validation**: express-validator
- **Security**: bcryptjs, helmet (recommended)

## 📞 Support

For security issues or questions:
1. Review [SECURITY.md](SECURITY.md)
2. Check [DEPLOYMENT.md](DEPLOYMENT.md) troubleshooting section
3. Run `./security-check.sh` for automated checks

## ✅ Step-By-Step (Vercel + Domain + Supabase)

Follow these steps in order.

### 1. Prepare Supabase

1. Create a Supabase project.
2. Open SQL Editor in Supabase.
3. Run schema from `api/database-supabase.sql`.
4. Copy your Postgres connection string (Transaction mode recommended).

### 2. Configure Vercel Environment Variables (Production)

In Vercel -> Project -> Settings -> Environment Variables, add:

```env
DB_DIALECT=postgres
SUPABASE_DB_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
JWT_SECRET=replace_with_64_plus_char_random_secret
FRONTEND_URL=https://www.ntdev.lt
NODE_ENV=production
```

Optional variables (if needed):

```env
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_CALLBACK_URL=https://www.ntdev.lt/api/auth/google/callback
EMAIL_USER=...
EMAIL_PASSWORD=...
```

Generate JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 3. Add Domain in Vercel

1. Go to Vercel -> Project -> Settings -> Domains.
2. Add `ntdev.lt` and `www.ntdev.lt`.
3. Connect both to `Production`.
4. Choose your preferred redirect direction (`ntdev.lt -> www.ntdev.lt` or reverse).

### 4. Configure DNS at Registrar (Interneto Vizija)

1. Open domain zone editor (`Redaguoti zoną`).
2. Set root A record:
   `A @ 216.198.79.1`
3. Set `www` CNAME record:
   `CNAME www <exact value shown by Vercel for your project>`
4. Keep MX/TXT records if you use email.
5. Save changes.

### 5. DNSSEC Check

If cert generation fails with DNSSEC errors:

1. Disable DNSSEC for the domain (or remove DS records at registrar).
2. Wait for propagation.
3. Press `Refresh` in Vercel Domains panel.

### 6. Redeploy After Env/DNS Changes

1. Redeploy latest deployment in Vercel.
2. Wait until deployment is ready.

### 7. Verify API and App

Check these URLs:

1. `https://www.ntdev.lt/api/projects` (should return JSON)
2. `https://www.ntdev.lt/api/content`
3. Front page should load normally.
4. Register/login should work.

### 8. Admin Panel (Only If Separate Project)

If admin is deployed as a separate Vercel project/domain, set:

```env
VITE_API_BASE_URL=https://www.ntdev.lt
```

Then redeploy the admin project.

### 9. Quick Troubleshooting

1. `500 FUNCTION_INVOCATION_FAILED`: missing or wrong env vars.
2. CORS errors from localhost: `FRONTEND_URL` mismatch or missing redeploy.
3. `Failed to generate cert`: DNSSEC/DS issue, disable DNSSEC or fix DS/DNSKEY chain.

## ⚙️ Environment Variables

### Vercel Production (Supabase) - Copy/Paste Values

Set these in Vercel -> Project -> Settings -> Environment Variables for `Production`.

```env
DB_DIALECT=postgres
SUPABASE_DB_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
JWT_SECRET=replace_with_64_plus_char_random_secret
FRONTEND_URL=https://www.ntdev.lt
NODE_ENV=production
```

Generate JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Optional (Only If You Use Them)

```env
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_CALLBACK_URL=https://www.ntdev.lt/api/auth/google/callback
EMAIL_USER=...
EMAIL_PASSWORD=...
```

### Admin Panel (If Deployed Separately)

If `admin` is deployed as a separate Vercel project/domain, add this variable in that admin project:

```env
VITE_API_BASE_URL=https://www.ntdev.lt
```

If admin and API are served from the same domain/project, this variable is not required.

### MySQL Alternative (Only If Not Using Supabase)

Use this set only when `DB_DIALECT=mysql`:

```env
DB_DIALECT=mysql
MYSQL_HOST=...
MYSQL_USER=...
MYSQL_PASSWORD=...
MYSQL_DATABASE=projects
MYSQL_PORT=3306
JWT_SECRET=replace_with_64_plus_char_random_secret
FRONTEND_URL=https://www.ntdev.lt
NODE_ENV=production
```

### Domain + DNS Required Values (for Vercel)

At your DNS provider (for example, Interneto Vizija), set:

```text
A      @     216.198.79.1
CNAME  www   <exact value shown in Vercel Domains panel>
```

Important:
- Use the exact `www` CNAME value shown in Vercel for your project.
- If SSL cert generation fails with DNSSEC errors, disable DNSSEC (or remove DS records), wait for propagation, then refresh Vercel.

### After Any Environment Variable Change

1. Redeploy the project in Vercel.
2. Test API health endpoint, for example: `/api/projects`.
3. Test auth endpoints: `/api/auth/register` and `/api/auth/login`.

### Common Errors and Fixes

- `500 FUNCTION_INVOCATION_FAILED`:
   Missing or invalid env vars (usually `JWT_SECRET`, `DB_DIALECT`, `SUPABASE_DB_URL`).
- CORS error from localhost:
   Set `FRONTEND_URL` correctly and redeploy.
- `Failed to generate cert` with DNSSEC text:
   DNSSEC/DS mismatch at registrar. Disable DNSSEC or correct DS/DNSKEY chain.

## 🔄 Maintenance

- **Updates**: Run `npm audit` monthly
- **Backups**: Daily automated database backups
- **Logs**: Monitor PM2 and Nginx logs
- **Certificates**: Auto-renewal with Let's Encrypt
- **Dependencies**: Keep Node.js and packages updated

## ⚡ Performance

- Production builds optimized
- Static assets with caching headers
- Gzip compression enabled
- Database connection pooling
- PM2 cluster mode support

## 🐛 Known Issues

None currently. Run security check regularly.

## 📝 License

Private project - All rights reserved

---

**Last Security Audit**: February 27, 2026
**Status**: ✅ Ready for Production (after fixing email credentials)
