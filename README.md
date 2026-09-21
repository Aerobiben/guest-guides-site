# Digital Guidebook

A modular Airbnb guest site for hosts. Edit photos, Wi‑Fi, check-in, map, and house notes in the builder, then download a single HTML file to send guests.

## Pages

- `index.html` — landing page at `/`
- `studio.html` — the builder at `/studio`
- `samples/*.html` — exported guest guides

## Use it

1. Open the builder at `/studio`.
2. Start from a template or a blank guidebook.
3. Change pictures (URL or upload) and the stay details.
4. Watch the phone preview on the right.
5. Click **Download HTML**. That file is self-contained and ready to email, AirDrop, or host.

Guidebooks are saved in the browser (`localStorage`) so you can keep several properties.

## Dark mode

The landing page and builder follow the system setting and remember a manual choice under the `digital-guidebook-theme` key.

Each guidebook also carries a **guest theme**: `auto` (follow the guest's phone), `light`, or `dark`. Exported guides render accordingly and give the guest a toggle on the hero photo.

## Regenerating the samples

```bash
node scripts/generate-samples.js
```
