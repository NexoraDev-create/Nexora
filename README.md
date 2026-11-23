# Nexora

An independent English-language publication about practical technology, useful digital tools, productivity, and independent work.

## Local preview

From this directory:

```bash
python -m http.server 4173 --bind 127.0.0.1
```

Open `http://127.0.0.1:4173` on the same computer.

## Production build and checks

```bash
python tools/site_check.py
bash tools/build_site.sh
```

The build creates a clean production bundle in `dist/`. The audit checks page metadata, structured data, accessibility landmarks, duplicate IDs, local links and assets, and RSS feed consistency.

## Published site

- Live site: https://nexoradev-create.github.io/Nexora/
- Sitemap: https://nexoradev-create.github.io/Nexora/sitemap.xml
- RSS feed: https://nexoradev-create.github.io/Nexora/feed.xml
- Google Search Console verification file is published at the site root.

## Current contents

- Responsive editorial homepage with a premium dark visual identity.
- 19 practical English-language guides across digital tools, workflows, freelancing, security, accessibility, planning, and communication.
- About and Privacy pages.
- RSS 2.0 feed and XML sitemap.
- Keyboard skip links, visible focus states, labeled navigation, and reduced-motion support.
- Automated checks for metadata, JSON-LD, duplicate IDs, accessible landmarks, broken local links/assets, and RSS consistency.
- No analytics, advertising, newsletter collection, user accounts, or tracking scripts are enabled.

## Before monetization

- Review and finalize the privacy policy so it accurately describes the live host and any services enabled later.
- Establish a safe public contact method appropriate for an independent publication.
- Fact-check changing software details and add reliable primary references where needed.
- Test deployed pages on phones and desktop.
- Keep analytics, advertising, forms, and newsletter collection disabled until their privacy disclosures and consent requirements are handled.
- Monetization and payment services have separate eligibility requirements; any service requiring an adult account holder must be managed by a parent or guardian.

## Editorial standard

Prioritize practical, specific guidance over generic search-engine filler. Clearly distinguish editorial content from advertising or affiliate links. Update articles when product details or policies change.
