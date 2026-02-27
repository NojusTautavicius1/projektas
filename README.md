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

## ⚙️ Environment Variables

### Required for Production:
- `JWT_SECRET` - Strong secret (64+ chars)
- `MYSQL_*` - Database connection details
- `FRONTEND_URL` - Your production domain
- `NODE_ENV=production`
- `EMAIL_*` - Email service credentials

### Optional:
- `GOOGLE_CLIENT_ID` - For OAuth
- `GOOGLE_CLIENT_SECRET` - For OAuth
- `PORT` - API port (default: 3000)

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
