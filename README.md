# Digital Guidebook

A modular Airbnb guest site for hosts. Edit photos, Wi‑Fi, check-in, map, and house notes in the builder, then download a single HTML file to send guests.

## Two deployments

| Site | Source | What visitors can do |
| --- | --- | --- |
| Main | repo root, served as-is | Browse the landing page and sample guides; the builder needs a password |
| Preview gallery | `preview-dist/`, built by `scripts/build-preview.js` | View sample guides only — no editor, no download |

## Builder password

`middleware.js` puts HTTP Basic Auth in front of `/studio` and the studio-only assets.
The landing page, the exported sample guides and the preview gallery stay public.

| Variable | Default | Purpose |
| --- | --- | --- |
| `STUDIO_USER` | `host` | Username for the prompt |
| `STUDIO_PASSWORD` | — | Password. Rotate it in the Vercel project settings. |

With no `STUDIO_PASSWORD` set the gate fails closed and returns 503, so a misconfigured
deployment never exposes the builder. Native Vercel password protection would be simpler but
requires a Pro plan.

## Pages (main site)

- `index.html` — landing page at `/`
- `studio.html` — the builder at `/studio`
- `samples/*.html` — exported guest guides

## Preview gallery

`preview/` holds the gallery source. `scripts/build-preview.js` copies only viewer assets
(`css/tokens.css`, `css/guest.css`, `js/theme.js`, `js/guest-render.js`) into `preview-dist/`,
renders a full-page guide per guidebook, and fails the build if a file matching `studio` or
`export` would ship, or if `index.html` references a file the bundle does not contain.

Vercel project settings:

- Build command: `node scripts/build-preview.js`
- Output directory: `preview-dist`

```bash
node scripts/build-preview.js
```

### Where the data comes from

Guidebook content lives in a **private** repository so door codes, Wi‑Fi passwords and phone
numbers stay out of this public repo. The build reads it over the GitHub contents API and bakes
the result into static HTML, so the token never reaches a visitor's browser.

Sources are tried in order, and the build falls back rather than failing:

1. `GUIDEBOOK_DATA_DIR` — a local directory of `.json` files (handy offline)
2. `GUIDEBOOK_DATA_REPO` — the private repo, via the contents API
3. the bundled sample templates

| Variable | Default | Purpose |
| --- | --- | --- |
| `GUIDEBOOK_DATA_REPO` | — | `owner/name` of the private data repo |
| `GUIDEBOOK_DATA_TOKEN` | — | Read-only token with access to that repo |
| `GUIDEBOOK_DATA_REF` | `main` | Branch to read |
| `GUIDEBOOK_DATA_PATH` | `guidebooks` | Directory of `.json` files |
| `GUIDEBOOK_DATA_DIR` | — | Local directory, overrides the repo |
| `GUIDEBOOK_DATA_API` | `https://api.github.com` | For GitHub Enterprise or testing |

### Creating the private data repo

```bash
node scripts/init-data-repo.js          # writes ./data-repo (gitignored)
gh repo create <owner>/guest-guides-data --private
cd data-repo && git init -b main && git add . && git commit -m "Add guidebook data"
git remote add origin git@github.com:<owner>/guest-guides-data.git && git push -u origin main
```

Then add `GUIDEBOOK_DATA_TOKEN` to the preview project in Vercel. The scaffold includes a
workflow that pings a Vercel deploy hook whenever `guidebooks/**` changes, so editing data
rebuilds the gallery.

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
