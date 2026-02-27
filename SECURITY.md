# Security Checklist for Production Deployment

## ✅ Completed Security Measures

### 1. Environment Variables & Secrets
- ✅ `.env` file is in `.gitignore` (not tracked by Git)
- ✅ All sensitive data uses environment variables
- ✅ `.env.example` provided without sensitive data
- ✅ No hardcoded passwords, API keys, or secrets in code

### 2. Database Security
- ✅ All database queries use parameterized statements (protection against SQL injection)
- ✅ Database credentials stored in environment variables only
- ✅ Password hashing using bcryptjs for user passwords
- ✅ No raw SQL queries with string concatenation

### 3. Authentication & Authorization
- ✅ JWT tokens with secure secret
- ✅ Password validation (minimum 6 characters)
- ✅ Email validation
- ✅ User input sanitization (express-validator with escape())
- ✅ Admin role protection middleware
- ✅ Authentication middleware on protected routes

### 4. CORS Configuration
- ✅ CORS configured for specific origins
- ✅ Production/development environment separation
- ✅ Credentials enabled only for trusted origins

### 5. Error Handling
- ✅ Centralized error handling
- ✅ No sensitive information in error messages
- ✅ Proper HTTP status codes

## 🔒 Before Going to Production

### Required Actions:

1. **Generate Strong JWT Secret**
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```
   Add this to your production `.env` file as `JWT_SECRET`

2. **Update Production Environment Variables**
   - Copy `.env.production.example` to `.env`
   - Fill in all production values
   - Never commit the actual `.env` file

3. **Database Security**
   - Use a strong MySQL password (min 16 characters, mixed case, numbers, special chars)
   - Create a dedicated database user with limited privileges (not root)
   - Only grant necessary permissions (SELECT, INSERT, UPDATE, DELETE on specific tables)
   - Enable MySQL SSL/TLS connections if possible

4. **Update CORS Origins**
   - Set `FRONTEND_URL` to your actual production domain
   - Remove any development URLs from production

5. **HTTPS Only**
   - Deploy behind HTTPS/TLS (use Let's Encrypt, Cloudflare, or similar)
   - Update all URLs to use `https://`
   - Set secure cookie flags if using sessions

6. **Email Configuration**
   - Use app-specific password for Gmail (not your actual password)
   - Or use a dedicated email service (SendGrid, AWS SES, etc.)

7. **Server Configuration**
   - Set `NODE_ENV=production`
   - Use a process manager (PM2, systemd)
   - Set up automatic restarts
   - Configure logging

8. **File Upload Security**
   - File upload size limits are configured
   - Only specific file types allowed (images)
   - Files stored outside web root or with proper access controls

9. **Rate Limiting** (Recommended to add)
   ```bash
   npm install express-rate-limit
   ```
   Implement rate limiting on auth endpoints

10. **Security Headers** (Recommended to add)
    ```bash
    npm install helmet
    ```
    Add Helmet middleware for security headers

## 🚨 Common Security Issues to Avoid

### Never Do:
- ❌ Commit `.env` file to Git
- ❌ Use default passwords or weak secrets
- ❌ Log sensitive data (passwords, tokens, API keys)
- ❌ Expose database errors to clients
- ❌ Allow unrestricted CORS (origin: '*')
- ❌ Store passwords in plain text
- ❌ Use HTTP in production (always HTTPS)

### Always Do:
- ✅ Keep dependencies updated (`npm audit`, `npm update`)
- ✅ Use environment variables for configuration
- ✅ Validate and sanitize all user input
- ✅ Use parameterized queries
- ✅ Implement proper authentication and authorization
- ✅ Log security events (failed logins, etc.)
- ✅ Regular backups of database
- ✅ Monitor for suspicious activity

## 🔐 Email Credentials in .env.example

**IMPORTANT:** The `.env.example` file previously contained actual email credentials. These have been removed.

If these credentials were:
1. Ever committed to Git history
2. Shared publicly

**You MUST:**
1. Change the email password immediately
2. Generate new app-specific password
3. Review email account for unauthorized access
4. Consider rotating all other secrets as well

## 📋 Deployment Checklist

Before deploying to production, verify:

- [ ] All environment variables set in production `.env`
- [ ] Strong JWT secret generated (64+ characters)
- [ ] Strong database password (16+ characters)
- [ ] Database user with minimal privileges created
- [ ] CORS configured for production domain only
- [ ] HTTPS/SSL certificate installed and configured
- [ ] Email app-specific password configured
- [ ] File upload restrictions in place
- [ ] Error logging configured
- [ ] Database backups automated
- [ ] Process manager configured (PM2)
- [ ] Firewall rules configured
- [ ] Rate limiting implemented (recommended)
- [ ] Security headers added (recommended)
- [ ] `NODE_ENV=production` set
- [ ] All sensitive data removed from Git history
- [ ] Audit logs reviewed

## 🔄 Regular Maintenance

- Update dependencies monthly: `npm audit` and `npm update`
- Review access logs for suspicious activity
- Test database backups quarterly
- Rotate secrets annually or after any security incident
- Keep Node.js updated to latest LTS version

## 📞 Security Contact

If you discover a security vulnerability, please report it responsibly.
