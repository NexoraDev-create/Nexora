#!/usr/bin/env python3
"""Small local quality check for the Nexora static site."""
from html.parser import HTMLParser
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parent.parent

class AuditParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []
        self.description = False
        self.lang = False
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "html":
            self.lang = bool(attrs.get("lang"))
        if tag in ("a", "link") and attrs.get("href"):
            self.links.append(attrs["href"])
        if tag == "meta" and attrs.get("name") == "description":
            self.description = bool(attrs.get("content", "").strip())

errors = []
pages = sorted(ROOT.rglob("*.html"))
for page in pages:
    parser = AuditParser()
    try:
        parser.feed(page.read_text(encoding="utf-8"))
    except Exception as exc:
        errors.append(f"{page.relative_to(ROOT)}: HTML parse error: {exc}")
        continue
    rel = page.relative_to(ROOT)
    if not parser.lang:
        errors.append(f"{rel}: missing html lang attribute")
    if not parser.description:
        errors.append(f"{rel}: missing meta description")
    for href in parser.links:
        if href.startswith(("https://", "http://", "mailto:", "tel:", "#", "data:")):
            continue
        path = href.split("#", 1)[0].split("?", 1)[0]
        if not path:
            continue
        target = (page.parent / path).resolve()
        if not target.exists():
            errors.append(f"{rel}: broken local link -> {href}")

print(f"Checked {len(pages)} HTML pages.")
if errors:
    print(f"Found {len(errors)} issue(s):")
    for error in errors:
        print(" -", error)
    sys.exit(1)
print("No missing language tags, descriptions, or broken local links found.")
