#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

python3 tools/site_check.py
rm -rf dist
mkdir -p dist/articles
cp ./*.html ./*.css ./*.js ./*.svg robots.txt sitemap.xml dist/
cp articles/*.html dist/articles/

printf '\nBuilt production site in %s/dist\n' "$ROOT"
printf 'HTML pages: %s\n' "$(find dist -name '*.html' -type f | wc -l)"
printf 'Files: %s\n' "$(find dist -type f | wc -l)"
