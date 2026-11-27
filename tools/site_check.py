#!/usr/bin/env python3
"""Validate Nexora's local HTML pages and their local asset/link targets."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit
import json
import re
import sys
import xml.etree.ElementTree as ET

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
        self.skip_link = False
        self.main_id = False
        self.nav_label = False
        self.missing_alt = 0
        self.title = False
        self.canonical = False
        self.og_url = False

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "html":
            self.lang = bool(attrs.get("lang"))
        if tag == "title":
            self.title = True
        if tag == "link" and attrs.get("rel", "").lower() == "canonical" and attrs.get("href", "").startswith("https://nexoradev-create.github.io/Nexora/"):
            self.canonical = True
        if tag == "meta" and attrs.get("property") == "og:url" and attrs.get("content", "").startswith("https://nexoradev-create.github.io/Nexora/"):
            self.og_url = True
        if tag == "img" and "alt" not in attrs:
            self.missing_alt += 1
        if tag == "a" and "skip-link" in attrs.get("class", "").split() and attrs.get("href") == "#main-content":
            self.skip_link = True
        if tag == "main" and attrs.get("id") == "main-content":
            self.main_id = True
        if tag == "nav" and attrs.get("aria-label", "").strip():
            self.nav_label = True
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
pages = sorted(p for p in ROOT.glob("*.html") if not p.name.startswith("google")) + sorted((ROOT / "articles").glob("*.html")) + sorted((ROOT / "discoveries").glob("*.html"))
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
    source = page.read_text(encoding="utf-8")
    schema_blocks = re.findall(r'<script\s+type=["\']application/ld\+json["\']\s*>(.*?)</script>', source, re.I | re.S)
    schemas = []
    for block in schema_blocks:
        try:
            schemas.append(json.loads(block))
        except json.JSONDecodeError as exc:
            errors.append(f"{rel}: invalid JSON-LD: {exc}")
    if page.name != "404.html" and not schemas:
        errors.append(f"{rel}: missing structured data (JSON-LD)")
    if (page.parent.name == "articles" or (page.parent.name == "discoveries" and page.name != "index.html")) and schemas and schemas[0].get("@type") != "Article":
        errors.append(f"{rel}: article page must use Article structured data")
    if not parser.lang:
        errors.append(f"{rel}: missing html lang attribute")
    if not parser.description:
        errors.append(f"{rel}: missing meta description")
    if not parser.title:
        errors.append(f"{rel}: missing title element")
    if page.name != "404.html" and not parser.canonical:
        errors.append(f"{rel}: missing or invalid canonical URL")
    if page.name != "404.html" and not parser.og_url:
        errors.append(f"{rel}: missing or invalid Open Graph URL")
    if parser.missing_alt:
        errors.append(f"{rel}: {parser.missing_alt} image(s) missing alt text")
    if not parser.skip_link:
        errors.append(f"{rel}: missing skip link to main content")
    if not parser.main_id:
        errors.append(f"{rel}: missing main-content landmark id")
    if not parser.nav_label:
        errors.append(f"{rel}: navigation missing accessible label")
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

feed_path = ROOT / "feed.xml"
try:
    feed_root = ET.parse(feed_path).getroot()
    items = feed_root.findall("./channel/item")
    expected_items = len(list((ROOT / "articles").glob("*.html")))
    if feed_root.tag != "rss" or len(items) != expected_items:
        errors.append(f"feed.xml: expected {expected_items} article items, found {len(items)}")
    for item in items:
        if not item.findtext("title") or not item.findtext("link") or not item.findtext("description"):
            errors.append("feed.xml: item missing title, link, or description")
except (ET.ParseError, OSError) as exc:
    errors.append(f"feed.xml: invalid or missing RSS feed: {exc}")

print(f"Checked {len(parsed)} HTML pages.")
if errors:
    print(f"Found {len(errors)} issue(s):")
    for error in errors:
        print(" -", error)
    sys.exit(1)
print("No missing metadata, duplicate IDs, or broken local links/assets found.")
