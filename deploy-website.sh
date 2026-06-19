#!/usr/bin/env bash
# deploy-website.sh
# Run this on the VPS from inside the oyuns-finance repo directory.
# It wires the website container into the existing app nginx and issues a cert.
set -e

REPO_DIR="$(cd "$(dirname "$0")" && pwd)"
APP_NGINX_CONF_DIR="/path/to/oyunswebapp/nginx/conf.d"   # <-- UPDATE THIS
CERTBOT_WEBROOT="/var/www/certbot"                        # must match app nginx config

echo "=== Step 1: Start website container ==="
cd "$REPO_DIR"
docker compose up -d --build
docker ps | grep oyuns-website-1

echo ""
echo "=== Step 2: Copy nginx config into app nginx ==="
# Replace /path/to/oyunswebapp with the actual path on your VPS
cp "$REPO_DIR/nginx-website.conf" "$APP_NGINX_CONF_DIR/oyuns-website.conf"

echo ""
echo "=== Step 3: Reload app nginx (HTTP only, to pass ACME challenge) ==="
# The HTTP-only server blocks in nginx-website.conf exist before the cert does.
# Temporarily comment out the ssl_* lines in oyuns-website.conf if the cert
# doesn't exist yet (first run), then re-enable after cert is issued.
#
# Quick approach: use --nginx mode of certbot running inside the nginx container,
# OR use standalone system certbot if installed on the host.

echo ""
echo "=== Step 4: Issue Let's Encrypt certificate ==="
echo "Choose ONE of the methods below depending on your setup:"
echo ""
echo "--- Method A: System certbot (if installed on VPS host) ---"
echo "  sudo certbot certonly --webroot -w $CERTBOT_WEBROOT \\"
echo "    -d oyuns.mn -d www.oyuns.mn \\"
echo "    --email info@oyuns.mn --agree-tos --no-eff-email"
echo ""
echo "--- Method B: Certbot inside the app nginx container ---"
echo "  docker exec oyunswebapp-nginx-1 certbot --nginx \\"
echo "    -d oyuns.mn -d www.oyuns.mn \\"
echo "    --email info@oyuns.mn --agree-tos --no-eff-email"
echo ""
echo "--- Method C: Standalone certbot container (no running nginx conflict) ---"
echo "  # Stop nginx first, run certbot, restart nginx"
echo "  docker compose -f /path/to/oyunswebapp/docker-compose.yml stop nginx"
echo "  docker run --rm -p 80:80 \\"
echo "    -v /etc/letsencrypt:/etc/letsencrypt \\"
echo "    certbot/certbot certonly --standalone \\"
echo "    -d oyuns.mn -d www.oyuns.mn \\"
echo "    --email info@oyuns.mn --agree-tos --no-eff-email"
echo "  docker compose -f /path/to/oyunswebapp/docker-compose.yml start nginx"
echo ""
echo "=== Step 5: Enable the HTTPS blocks and reload nginx ==="
echo "  After cert is issued, reload the app nginx:"
echo "  docker exec oyunswebapp-nginx-1 nginx -t"
echo "  docker exec oyunswebapp-nginx-1 nginx -s reload"
echo ""
echo "=== Step 6: Verify ==="
echo "  curl -I https://oyuns.mn       # Should 301 → https://www.oyuns.mn"
echo "  curl -I https://www.oyuns.mn   # Should 200 with Next.js content"
echo "  openssl s_client -connect www.oyuns.mn:443 -servername www.oyuns.mn 2>/dev/null \\"
echo "    | openssl x509 -noout -subject -ext subjectAltName"
echo "  # Expected: CN=oyuns.mn, SAN includes oyuns.mn and www.oyuns.mn"
