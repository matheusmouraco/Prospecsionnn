#!/usr/bin/env bash
# Runs on the Mac: copies the project (code, .env, reference prints and out/) to the VPS and restarts pm2.
set -euo pipefail
VPS="${VPS:-root@72.61.57.12}"
cd "$(dirname "$0")/.."
ssh "$VPS" 'mkdir -p /opt/prospector'
rsync -az --delete --exclude node_modules --exclude dist --exclude .git ./ "$VPS:/opt/prospector/"
ssh "$VPS" 'cd /opt/prospector && (command -v pm2 >/dev/null && npm ci --silent && pm2 reload deploy/ecosystem.config.cjs || true)'
echo "Copiado para $VPS:/opt/prospector"
