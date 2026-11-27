#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

python3 tools/generate_discoveries.py
python3 tools/site_check.py
rm -rf dist
mkdir -p dist/articles dist/discoveries
cp ./*.html ./*.css ./*.js ./*.svg robots.txt sitemap.xml feed.xml dist/
cp articles/*.html dist/articles/
cp discoveries/*.html dist/discoveries/
cp discoveries.js discovery-share.svg discoveries.json dist/

printf '\nBuilt production site in %s/dist\n' "$ROOT"
printf 'HTML pages: %s\n' "$(find dist -name '*.html' -type f | wc -l)"
printf 'Files: %s\n' "$(find dist -type f | wc -l)"
