# Nexora

Nexora is an independent knowledge platform in development. Its goal is to turn curiosity into exploration through daily discoveries, interactive experiments, challenges, and original research.

## Local preview

From this directory:

```bash
python -m http.server 4173 --bind 127.0.0.1
```

Open `http://127.0.0.1:4173` on the same computer.

## Checks and production build

```bash
python tools/site_check.py
bash tools/build_site.sh
```

The build creates a clean production bundle in `dist/`. The audit checks metadata, structured data, accessibility landmarks, duplicate IDs, local links/assets, and RSS feed consistency.

## Published site

- Live site: https://nexoradev-create.github.io/Nexora/
- Sitemap: https://nexoradev-create.github.io/Nexora/sitemap.xml
- RSS feed: https://nexoradev-create.github.io/Nexora/feed.xml

## Current prototype

- Portuguese-language homepage and responsive dark visual identity.
- Daily discovery selected by date, with an external reference source.
- Interactive inverse-square light-intensity experiment.
- Daily multiple-choice challenge with answer explanation.
- Preview cards for future Nexora Originals projects.
- Searchable Portuguese index for the retained English practical guides, with the language clearly labeled.
- Daily missions, XP, best streak, seven-day activity history, and permanent achievements are stored locally in the visitor browser.
- Installable PWA shell with offline access to the homepage, discovery archive, weekly case archive, and discovery pages after the first online visit.
- No analytics, advertising, newsletter collection, user accounts, or visitor tracking are enabled.

## Before public relaunch or monetization

- Review and fact-check all daily discovery entries and their sources.
- Expand the Lab and build the Atlas and Originals experiences before presenting them as finished features.
- Update the RSS feed and sitemap to reflect the new editorial direction.
- Test the deployed site on phones and desktop.
- Keep analytics, advertising, forms, and newsletter collection disabled until their privacy disclosures and consent requirements are handled.
- Monetization and payment services have separate eligibility requirements; any service requiring an adult account holder must be managed by a parent or guardian.

## Editorial standard

Prioritize original, useful, source-backed content. Clearly distinguish verified facts, interpretations, and hypothetical scenarios. Never publish generic filler just to increase article count.
