#!/usr/bin/env python3
"""Validate Nexora's local HTML pages and their local asset/link targets."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit
import sys

ROOT = Path(__file__).resolve().parent.parent
CHECKED_ATTRS = {
    "a": ("href",),
    "link": ("href",),
    "img": ("src",),
    "script": ("src",),
    "source": ("src",),
    "video": ("poster",),
}

class AuditParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []
        self.ids = set()
        self.duplicates = set()
        self.description = False
        self.lang = False

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "html":
            self.lang = bool(attrs.get("lang"))
        if attrs.get("id"):
            if attrs["id"] in self.ids:
                self.duplicates.add(attrs["id"])
            self.ids.add(attrs["id"])
        if tag in CHECKED_ATTRS:
            for attr in CHECKED_ATTRS[tag]:
                if attrs.get(attr):
                    self.links.append(attrs[attr])
        if tag == "meta" and attrs.get("name", "").lower() == "description":
            self.description = bool(attrs.get("content", "").strip())

errors = []
pages = sorted(ROOT.rglob("*.html"))
parsed = {}
for page in pages:
    parser = AuditParser()
    try:
        parser.feed(page.read_text(encoding="utf-8"))
    except Exception as exc:
        errors.append(f"{page.relative_to(ROOT)}: HTML parse error: {exc}")
        continue
    parsed[page.resolve()] = parser
    rel = page.relative_to(ROOT)
    if not parser.lang:
        errors.append(f"{rel}: missing html lang attribute")
    if not parser.description:
        errors.append(f"{rel}: missing meta description")
    for duplicate in sorted(parser.duplicates):
        errors.append(f"{rel}: duplicate id -> {duplicate}")

for page, parser in parsed.items():
    rel = page.relative_to(ROOT)
    for raw in parser.links:
        url = urlsplit(raw)
        if url.scheme or url.netloc or raw.startswith("//"):
            continue
        if not url.path and not url.fragment:
            continue
        if url.path.startswith("/"):
            target = (ROOT / url.path.lstrip("/")).resolve()
        else:
            target = (page.parent / url.path).resolve() if url.path else page
        if not target.exists():
            errors.append(f"{rel}: missing local target -> {raw}")
            continue
        if url.fragment and target.suffix.lower() == ".html":
            target_parser = parsed.get(target)
            if target_parser and url.fragment not in target_parser.ids:
                errors.append(f"{rel}: missing fragment target -> {raw}")

print(f"Checked {len(parsed)} HTML pages.")
if errors:
    print(f"Found {len(errors)} issue(s):")
    for error in errors:
        print(" -", error)
    sys.exit(1)
print("No missing metadata, duplicate IDs, or broken local links/assets found.")
