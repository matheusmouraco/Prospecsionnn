#!/usr/bin/env bash
# Regera as fontes recortadas em app/fonts a partir do pacote geist (precisa de: pip install fonttools brotli).
set -euo pipefail
cd "$(dirname "$0")/.."
TMP=$(mktemp -d)
U="U+0020-007E,U+00A0-00FF,U+0131,U+0152-0153,U+02C6,U+02DA,U+02DC,U+2013-2014,U+2018-201E,U+2022,U+2026,U+20AC,U+2122,U+2192"
python3 - "$TMP" <<'PY'
import sys
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
tmp = sys.argv[1]
for src, dst, rng in [
    ("node_modules/geist/dist/fonts/geist-sans/Geist-Variable.woff2", f"{tmp}/sans.ttf", (400, 600)),
    ("node_modules/geist/dist/fonts/geist-mono/GeistMono-Variable.woff2", f"{tmp}/mono.ttf", (400, 500)),
]:
    font = TTFont(src)
    font.flavor = None
    instancer.instantiateVariableFont(font, {"wght": rng}).save(dst)
PY
pyftsubset "$TMP/sans.ttf" --unicodes="$U" --layout-features='kern,liga,calt,ss01,tnum' --flavor=woff2 --output-file=app/fonts/geist-sans-latin.woff2
pyftsubset "$TMP/mono.ttf" --unicodes="$U" --layout-features='kern' --flavor=woff2 --output-file=app/fonts/geist-mono-latin.woff2
ls -la app/fonts
