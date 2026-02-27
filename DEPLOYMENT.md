# Production Deployment Guide

## Vercel Deployment (Recommended for Hobby Projects)

### Prerequisites
- GitHub account
- Vercel account (free tier available)
- MySQL database (e.g., PlanetScale, Railway, or other cloud provider)

### Step 1: Database Setup

Since Vercel is serverless, you need a cloud MySQL database. Options:
- **PlanetScale** (free tier, MySQL-compatible)
- **Railway** (free tier with MySQL)
- **AWS RDS** (paid)
- **DigitalOcean Managed Database** (paid)

### Step 2: Push to GitHub

```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### Step 3: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will auto-detect the configuration from `vercel.json`

### Step 4: Configure Environment Variables

In Vercel Dashboard → Your Project → Settings → Environment Variables, add:

```
JWT_SECRET=your_64_char_secret_generated_with_crypto
MYSQL_HOST=your_cloud_db_host
MYSQL_USER=your_db_user
MYSQL_PASSWORD=your_db_password
MYSQL_DATABASE=projects
MYSQL_PORT=3306
FRONTEND_URL=https://your-vercel-domain.vercel.app
NODE_ENV=production
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_email_app_password
```

**Important Notes:**
- All API routes created by Vercel as ONE serverless function (Hobby plan limit: 12 functions)
- Database must be accessible from external connections
- Enable SSL for MySQL connection in production

### Step 5: Deploy

Click "Deploy" and wait for the build to complete!

---

## Traditional Server Deployment

### Prerequisites
- Node.js 18+ and npm
- MySQL 8.0+
- HTTPS certificate (Let's Encrypt recommended)
- Domain name configured

### Step 1: Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js (if not installed)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 (process manager)
sudo npm install -g pm2

# Install MySQL (if not installed)
sudo apt install mysql-server
sudo mysql_secure_installation
```

### Step 2: Database Setup

```bash
# Login to MySQL
mysql -u root -p

# Create production database
CREATE DATABASE projects CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Create dedicated user with limited privileges
CREATE USER 'portfolio_user'@'localhost' IDENTIFIED BY 'STRONG_PASSWORD_HERE';

# Grant only necessary permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON projects.* TO 'portfolio_user'@'localhost';
FLUSH PRIVILEGES;

# Import database schema
USE projects;
SOURCE /path/to/your/database-full.sql;

# Exit MySQL
EXIT;
```

### Step 3: Clone and Setup Project

```bash
# Clone your repository (or upload files)
git clone https://github.com/yourusername/yourrepo.git portfolio
cd portfolio

# Setup API
cd api
cp .env.example .env
nano .env  # Edit with your production values

# Install dependencies
npm ci --production

# Setup Frontend
cd ../front
npm ci
npm run build

# Setup Admin (if needed)
cd ../admin
npm ci
npm run build
```

### Step 4: Configure Environment Variables

Edit `api/.env`:

```bash
nano api/.env
```

**Required values:**
```env
JWT_SECRET=your_64_char_secret_generated_with_crypto
MYSQL_HOST=localhost
MYSQL_USER=portfolio_user
MYSQL_PASSWORD=your_strong_database_password
MYSQL_DATABASE=projects
MYSQL_PORT=3306
FRONTEND_URL=https://yourdomain.com
NODE_ENV=production
PORT=3000
```

**Generate JWT Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Step 5: Setup Nginx Reverse Proxy

```bash
sudo apt install nginx

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/portfolio
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Frontend (built React app)
    root /var/www/portfolio/front/dist;
    index index.html;

    # Frontend routes
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Static files (images, etc.)
    location /images {
        alias /var/www/portfolio/api/public/images;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Project files
    location /projektas {
        alias /var/www/portfolio/AtsiskaitomiejiDarbai;
        try_files $uri $uri/ =404;
    }

    location /orai {
        alias /var/www/portfolio/AtsiskaitomiejiDarbai/orai;
        try_files $uri $uri/ =404;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 6: Setup SSL/HTTPS with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Certbot will automatically configure HTTPS and renewal.

### Step 7: Start API with PM2

```bash
cd /var/www/portfolio/api

# Start the application
pm2 start app.js --name portfolio-api

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Run the command that PM2 outputs

# Monitor logs
pm2 logs portfolio-api
```

### Step 8: Configure Firewall

```bash
# Allow SSH, HTTP, and HTTPS
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

## Monitoring and Maintenance

### View Logs
```bash
# PM2 logs
pm2 logs portfolio-api

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Restart Services
```bash
# Restart API
pm2 restart portfolio-api

# Restart Nginx
sudo systemctl restart nginx
```

### Database Backup
```bash
# Create backup script
mkdir -p ~/backups
nano ~/backup-db.sh
```

Add to `backup-db.sh`:
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mysqldump -u portfolio_user -p'your_password' projects > ~/backups/portfolio_$DATE.sql
# Keep only last 7 days
find ~/backups -name "portfolio_*.sql" -mtime +7 -delete
```

```bash
chmod +x ~/backup-db.sh

# Add to crontab (daily at 2 AM)
crontab -e
# Add: 0 2 * * * /home/youruser/backup-db.sh
```

## Update Deployment

```bash
cd /var/www/portfolio

# Pull latest changes
git pull

# Update API
cd api
npm ci --production
pm2 restart portfolio-api

# Update Frontend
cd ../front
npm ci
npm run build

# If Nginx config changed
sudo nginx -t
sudo systemctl reload nginx
```

## Security Hardening

### 1. Secure MySQL
```bash
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf
```
Ensure: `bind-address = 127.0.0.1`

### 2. Secure File Permissions
```bash
chmod 600 api/.env
chmod -R 755 api/public
```

### 3. Keep System Updated
```bash
sudo apt update && sudo apt upgrade -y
```

### 4. Monitor Failed Login Attempts
```bash
sudo apt install fail2ban
```

## Troubleshooting

### API Not Starting
```bash
pm2 logs portfolio-api --lines 50
```

### Database Connection Issues
```bash
# Test MySQL connection
mysql -u portfolio_user -p -h localhost projects
```

### Nginx 502 Bad Gateway
- Check if API is running: `pm2 status`
- Check API port: `netstat -tlnp | grep 3000`
- Check Nginx error log: `sudo tail -f /var/log/nginx/error.log`

### Permission Denied on File Uploads
```bash
sudo chown -R www-data:www-data /var/www/portfolio/api/public
```

## Performance Optimization

### Enable Gzip in Nginx
Add to your server block:
```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript;
```

### PM2 Cluster Mode (if needed)
```bash
pm2 start app.js --name portfolio-api -i max
```

## Health Checks

Create a simple health check endpoint in your API to monitor uptime.

## Support

For issues or questions about deployment, check:
1. PM2 logs: `pm2 logs`
2. Nginx logs: `/var/log/nginx/`
3. MySQL logs: `/var/log/mysql/`
4. Review SECURITY.md for security checklist
