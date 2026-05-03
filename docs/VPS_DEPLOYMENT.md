# VPS Deployment — Deep Reference

> **Part of Step 7 in the [master guide](COMPLETE_SETUP.md).** Go there first if you haven't completed Steps 1–6.

Deploy your OYUNS All-In-One Next.js website to a VPS (Virtual Private Server) with Nginx reverse proxy, PM2 process manager, and Let's Encrypt SSL.

---

## Prerequisites

1. A VPS with **Ubuntu 22.04+** (recommended providers: DigitalOcean, Hetzner, Vultr, Linode)
   - Minimum: 1 vCPU, 1 GB RAM, 25 GB SSD
   - Recommended: 2 vCPU, 2 GB RAM, 50 GB SSD
2. A domain name (e.g. `oyuns.mn`) with DNS access
3. SSH access to your server (root or sudo user)
4. GitHub account with your code pushed

---

## Step 1 — Initial Server Setup

### 1.1 Connect to your server

```bash
ssh root@YOUR_SERVER_IP
```

### 1.2 Create a deploy user (don't run the app as root)

```bash
adduser deploy
usermod -aG sudo deploy
```

### 1.3 Set up SSH key authentication for the deploy user

On your **local machine**:

```bash
ssh-copy-id deploy@YOUR_SERVER_IP
```

Then disable password auth on the server:

```bash
sudo nano /etc/ssh/sshd_config
# Set: PasswordAuthentication no
sudo systemctl restart sshd
```

### 1.4 Configure firewall (UFW)

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
sudo ufw status
```

Expected output:

```
Status: active
To                         Action      From
--                         ------      ----
OpenSSH                    ALLOW       Anywhere
80                         ALLOW       Anywhere
443                        ALLOW       Anywhere
```

---

## Step 2 — Install Node.js, Nginx, PM2

### 2.1 Install Node.js 20 LTS

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
node -v   # should show v20.x.x
npm -v    # should show 10.x.x
```

### 2.2 Install Nginx

```bash
sudo apt update
sudo apt install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

Verify: visit `http://YOUR_SERVER_IP` — you should see the Nginx welcome page.

### 2.3 Install PM2 (process manager)

```bash
sudo npm install -g pm2
pm2 --version
```

---

## Step 3 — Clone & Build the Project

### 3.1 Switch to the deploy user

```bash
su - deploy
```

### 3.2 Clone the repository

```bash
cd /home/deploy
git clone https://github.com/YOUR_USERNAME/oyuns-finance.git
cd oyuns-finance
```

### 3.3 Install dependencies

```bash
npm ci --production=false
```

> `npm ci` is faster and more reliable than `npm install` for deployments.

### 3.4 Create the environment file

```bash
nano .env.local
```

Paste your environment variables:

```env
# ── Directus (CMS) ──────────────────────────────
NEXT_PUBLIC_DIRECTUS_URL=https://your-directus-instance.com
DIRECTUS_STATIC_TOKEN=your-directus-static-token

# ── Supabase (Database) ─────────────────────────
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# ── Site ─────────────────────────────────────────
NEXT_PUBLIC_SITE_URL=https://oyuns.mn
PORT=3000
```

Save: `Ctrl+O`, `Enter`, `Ctrl+X`.

### 3.5 Build

```bash
npm run build
```

This creates the `.next/standalone` directory (configured in `next.config.ts`).

### 3.6 Copy static assets into standalone

```bash
cp -r .next/static .next/standalone/.next/static
cp -r public .next/standalone/public
```

---

## Step 4 — Run with PM2

### 4.1 Create PM2 ecosystem file

```bash
nano /home/deploy/oyuns-finance/ecosystem.config.cjs
```

```javascript
module.exports = {
  apps: [
    {
      name: 'oyuns-finance',
      cwd: '/home/deploy/oyuns-finance/.next/standalone',
      script: 'server.js',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOSTNAME: '0.0.0.0',
      },
      instances: 1,           // increase if you have multiple CPU cores
      exec_mode: 'fork',      // use 'cluster' with instances > 1
      max_memory_restart: '500M',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      error_file: '/home/deploy/logs/oyuns-error.log',
      out_file: '/home/deploy/logs/oyuns-out.log',
      merge_logs: true,
    },
  ],
};
```

### 4.2 Create log directory

```bash
mkdir -p /home/deploy/logs
```

### 4.3 Start the application

```bash
cd /home/deploy/oyuns-finance
pm2 start ecosystem.config.cjs
```

### 4.4 Verify it's running

```bash
pm2 status
```

Expected:

```
┌─────────────────┬────┬──────┬───────┬────────┬─────────┐
│ App name        │ id │ mode │ status│ cpu    │ memory  │
├─────────────────┼────┼──────┼───────┼────────┼─────────┤
│ oyuns-finance   │ 0  │ fork │ online│ 0%     │ 80 MB   │
└─────────────────┴────┴──────┴───────┴────────┴─────────┘
```

Test locally on the server:

```bash
curl http://localhost:3000
```

### 4.5 Enable PM2 startup on reboot

```bash
pm2 save
pm2 startup
# PM2 will print a command — copy and run it with sudo, e.g.:
# sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u deploy --hp /home/deploy
```

---

## Step 5 — Configure Nginx Reverse Proxy

### 5.1 Create Nginx site config

```bash
sudo nano /etc/nginx/sites-available/oyuns-finance
```

```nginx
server {
    listen 80;
    server_name oyuns.mn www.oyuns.mn;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml application/json application/javascript application/xml+rss application/atom+xml image/svg+xml;

    # Next.js static files — long cache
    location /_next/static {
        alias /home/deploy/oyuns-finance/.next/standalone/.next/static;
        expires 365d;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # Public folder static files
    location /public {
        alias /home/deploy/oyuns-finance/.next/standalone/public;
        expires 30d;
        add_header Cache-Control "public";
        access_log off;
    }

    # Favicon and other root-level static files
    location ~* ^/(favicon\.ico|robots\.txt|sitemap\.xml) {
        root /home/deploy/oyuns-finance/.next/standalone/public;
        expires 30d;
        access_log off;
    }

    # Proxy everything else to Next.js
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 60s;
        proxy_send_timeout 60s;
    }
}
```

### 5.2 Enable the site

```bash
sudo ln -s /etc/nginx/sites-available/oyuns-finance /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
```

### 5.3 Test and reload Nginx

```bash
sudo nginx -t
# Should say: syntax is ok / test is successful

sudo systemctl reload nginx
```

### 5.4 Verify

Visit `http://oyuns.mn` (or `http://YOUR_SERVER_IP` if DNS isn't set up yet). You should see your site.

---

## Step 6 — DNS Configuration

Point your domain to the server's IP address.

### A record

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | `@` | `YOUR_SERVER_IP` | 3600 |
| A | `www` | `YOUR_SERVER_IP` | 3600 |

Check propagation:

```bash
# On your local machine
nslookup oyuns.mn
# Or use https://www.whatsmydns.net/
```

---

## Step 7 — SSL with Let's Encrypt (Free HTTPS)

### 7.1 Install Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 7.2 Obtain certificate

```bash
sudo certbot --nginx -d oyuns.mn -d www.oyuns.mn
```

Follow the prompts:
1. Enter your email address
2. Agree to Terms of Service
3. Choose whether to redirect HTTP → HTTPS (select **Yes**)

Certbot will automatically:
- Obtain the SSL certificate
- Modify your Nginx config to serve HTTPS
- Set up HTTP → HTTPS redirect

### 7.3 Verify HTTPS

Visit `https://oyuns.mn` — you should see the padlock icon.

### 7.4 Auto-renewal

Certbot sets up a systemd timer for auto-renewal. Verify:

```bash
sudo certbot renew --dry-run
```

You can also check the timer:

```bash
sudo systemctl status certbot.timer
```

Certificates renew automatically every 60–90 days.

---

## Step 8 — Deployment Script (Automated Updates)

Create a deployment script for easy updates:

```bash
nano /home/deploy/deploy.sh
```

```bash
#!/bin/bash
set -e

APP_DIR="/home/deploy/oyuns-finance"
LOG_FILE="/home/deploy/logs/deploy.log"

echo "=== Deployment started at $(date) ===" | tee -a "$LOG_FILE"

cd "$APP_DIR"

# Pull latest code
echo "→ Pulling latest code..." | tee -a "$LOG_FILE"
git pull origin main 2>&1 | tee -a "$LOG_FILE"

# Install dependencies
echo "→ Installing dependencies..." | tee -a "$LOG_FILE"
npm ci --production=false 2>&1 | tee -a "$LOG_FILE"

# Build
echo "→ Building..." | tee -a "$LOG_FILE"
npm run build 2>&1 | tee -a "$LOG_FILE"

# Copy static assets
echo "→ Copying static assets..." | tee -a "$LOG_FILE"
cp -r .next/static .next/standalone/.next/static
cp -r public .next/standalone/public

# Restart PM2
echo "→ Restarting PM2..." | tee -a "$LOG_FILE"
pm2 restart oyuns-finance 2>&1 | tee -a "$LOG_FILE"

echo "=== Deployment finished at $(date) ===" | tee -a "$LOG_FILE"
echo ""
echo "✅ Site is live at https://oyuns.mn"
```

Make it executable:

```bash
chmod +x /home/deploy/deploy.sh
```

### Usage

Whenever you push to GitHub and want to deploy:

```bash
ssh deploy@YOUR_SERVER_IP
~/deploy.sh
```

---

## Optional: GitHub Actions CI/CD (Auto-Deploy on Push)

Create `.github/workflows/deploy.yml` in your repository:

```yaml
name: Deploy to VPS

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Deploy via SSH
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: /home/deploy/deploy.sh
```

### Set up GitHub Secrets

In your repo → **Settings → Secrets and variables → Actions**, add:

| Secret | Value |
|--------|-------|
| `VPS_HOST` | Your server IP (e.g. `203.0.113.50`) |
| `VPS_USER` | `deploy` |
| `VPS_SSH_KEY` | Contents of `~/.ssh/id_rsa` (the private key) |

Now every push to `main` automatically deploys to your VPS.

---

## Monitoring & Maintenance

### PM2 Commands

```bash
pm2 status                    # Check app status
pm2 logs oyuns-finance        # View live logs
pm2 logs oyuns-finance --lines 100  # Last 100 log lines
pm2 restart oyuns-finance     # Restart the app
pm2 stop oyuns-finance        # Stop the app
pm2 delete oyuns-finance      # Remove from PM2
pm2 monit                     # Real-time monitoring dashboard
```

### Nginx Commands

```bash
sudo nginx -t                 # Test config syntax
sudo systemctl reload nginx   # Reload after config change
sudo systemctl restart nginx  # Full restart
sudo tail -f /var/log/nginx/access.log   # Access logs
sudo tail -f /var/log/nginx/error.log    # Error logs
```

### Server Health

```bash
htop                          # CPU/Memory usage
df -h                         # Disk usage
free -h                       # Memory usage
uptime                        # Server uptime
```

### Log Rotation

PM2 has built-in log rotation:

```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
pm2 set pm2-logrotate:compress true
```

---

## Security Hardening

### Fail2Ban (brute-force protection)

```bash
sudo apt install -y fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### Automatic Security Updates

```bash
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
# Select Yes
```

### Rate Limiting in Nginx

Add to your Nginx config (outside the `server` block, in `/etc/nginx/nginx.conf`):

```nginx
http {
    # Rate limiting
    limit_req_zone $binary_remote_addr zone=general:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=api:10m rate=5r/s;

    # ... existing config ...
}
```

Then in your site config:

```nginx
location / {
    limit_req zone=general burst=20 nodelay;
    # ... existing proxy_pass config ...
}
```

---

## Rollback Strategy

If something goes wrong after a deploy:

### Option 1 — Git rollback

```bash
cd /home/deploy/oyuns-finance
git log --oneline -5          # Find the last good commit
git checkout <commit-hash>    # Switch to it
npm ci --production=false
npm run build
cp -r .next/static .next/standalone/.next/static
cp -r public .next/standalone/public
pm2 restart oyuns-finance
```

### Option 2 — PM2 rollback (if app crashes)

```bash
pm2 logs oyuns-finance --lines 50    # Check what went wrong
pm2 restart oyuns-finance            # Try restarting
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Nginx 502 Bad Gateway | App isn't running — check `pm2 status`. Restart with `pm2 restart oyuns-finance`. |
| Nginx 504 Gateway Timeout | App is too slow — check `pm2 logs`. May need more RAM. |
| Site not loading over HTTPS | Check SSL: `sudo certbot certificates`. Renew: `sudo certbot renew`. |
| `EADDRINUSE :3000` | Port 3000 already in use — kill old process: `sudo lsof -i :3000` then `kill -9 PID`. |
| Build fails on server | Not enough memory — add swap space (see below). |
| Permission denied | Check file ownership: `chown -R deploy:deploy /home/deploy/oyuns-finance`. |
| DNS not resolving | Check A records. Wait for propagation. Use `nslookup oyuns.mn`. |

### Adding Swap Space (if build runs out of memory)

```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

---

## Cost Estimation

| Provider | Plan | Price | Specs |
|----------|------|-------|-------|
| **Hetzner** | CX22 | ~€4/mo | 2 vCPU, 4 GB RAM, 40 GB SSD |
| **DigitalOcean** | Basic | $6/mo | 1 vCPU, 1 GB RAM, 25 GB SSD |
| **Vultr** | Cloud Compute | $6/mo | 1 vCPU, 1 GB RAM, 25 GB SSD |
| **Linode** | Nanode | $5/mo | 1 vCPU, 1 GB RAM, 25 GB SSD |

Plus:
- **Domain** (oyuns.mn): ~$15–30/year
- **SSL**: Free (Let's Encrypt)

---

## Useful Links

- [Next.js Standalone Deployment](https://nextjs.org/docs/app/api-reference/config/next-config-js/output)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt / Certbot](https://certbot.eff.org/)
- [DigitalOcean Tutorials](https://www.digitalocean.com/community/tutorials)
- [Ubuntu Server Guide](https://ubuntu.com/server/docs)

---

## Quick Reference Commands

```bash
# Deploy update
ssh deploy@YOUR_SERVER_IP
~/deploy.sh

# Check status
pm2 status
pm2 logs oyuns-finance

# Restart
pm2 restart oyuns-finance
sudo systemctl reload nginx

# SSL
sudo certbot renew --dry-run
sudo certbot certificates

# Server
htop
df -h
```
