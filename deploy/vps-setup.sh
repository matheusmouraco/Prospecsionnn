#!/usr/bin/env bash
# Runs once on the VPS (Ubuntu 24.04), as root: Node 20, Chromium for Playwright, pm2 and Brazil time.
set -euo pipefail
timedatectl set-timezone America/Sao_Paulo
apt-get update -y
apt-get install -y curl rsync ca-certificates
if ! command -v node >/dev/null || [ "$(node -v | cut -c2-3)" -lt 20 ]; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
fi
npm install -g pm2
cd /opt/prospector
npm ci
npx playwright install --with-deps chromium
pm2 start deploy/ecosystem.config.cjs
pm2 save
pm2 startup systemd -u root --hp /root | tail -1 | bash || true
echo "Pronto. Veja com: pm2 status"
