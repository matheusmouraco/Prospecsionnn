#!/usr/bin/env bash
# Runs on the Mac: copies the code to the VPS and restarts pm2. Never deletes on the server and never touches out/ or .env.
set -euo pipefail
# Guard: this branch must contain the Supporta generator, or the deploy would switch it off.
[ -f "$(dirname "$0")/../src/supporta/cycle.ts" ] || { echo "Este branch não tem o gerador da Supporta. Use o branch certo."; exit 1; }
VPS="${VPS:-root@72.61.57.12}"
cd "$(dirname "$0")/.."
ssh "$VPS" 'mkdir -p /opt/prospector'
rsync -az --exclude node_modules --exclude dist --exclude .git --exclude .next --exclude out --exclude .env --exclude .env.local --exclude referencias --exclude .DS_Store ./ "$VPS:/opt/prospector/"
ssh "$VPS" 'cd /opt/prospector && (command -v pm2 >/dev/null && npm ci --silent && pm2 reload deploy/ecosystem.config.cjs || true)'
echo "Copiado para $VPS:/opt/prospector"
