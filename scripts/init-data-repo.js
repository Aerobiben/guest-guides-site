const fs = require("fs");
const path = require("path");
const { ROOT, loadGuidebookModules } = require("./lib/guidebooks");

const OUT = path.join(ROOT, "data-repo");

const README = `# guest-guides-data

Private guidebook data for the [Digital Guidebook](https://guest-guides.vercel.app) preview
deployment. Keep this repository **private** — it holds door codes, Wi‑Fi passwords and host
phone numbers.

## Layout

\`\`\`
guidebooks/
  clement-street-hideaway.json
  ...
\`\`\`

One JSON file per property. Filenames are sorted, so a numeric prefix (\`01-\`, \`02-\`) controls
the order they appear in the gallery.

## Fields

| Field | Notes |
| --- | --- |
| \`slug\` | URL for the full-page guide. Derived from \`propertyName\` when omitted. |
| \`theme\` | \`auto\`, \`light\` or \`dark\` — how the guest guide renders. |
| \`propertyName\`, \`hostName\`, \`hostPhone\`, \`listingUrl\` | Header and contact details. |
| \`intro.welcome\`, \`intro.about\` | Opening copy. |
| \`address\` | \`city\`, \`country\`, \`lat\`, \`lng\`, \`linkBehavior\`, … drives the map. |
| \`photos[]\` | \`{ url, caption }\`. The first becomes the hero image. |
| \`wifi\`, \`checkIn\`, \`checkOut\`, \`parking\`, \`directions\` | Stay details. |
| \`houseManual[]\`, \`houseRules[]\`, \`recommendations[]\` | Repeating sections. |

Missing fields fall back to sensible defaults, so a partial file still renders.

## How it reaches the site

The preview deployment reads this repository **at build time** using a read-only token, then
renders static HTML. The token never reaches a visitor's browser, and this repository is never
referenced from the deployed site.

Edit a file here and the workflow in \`.github/workflows/redeploy-preview.yml\` triggers a fresh
build, provided the \`VERCEL_DEPLOY_HOOK\` secret is set.
`;

const WORKFLOW = `name: Redeploy preview site

on:
  push:
    branches: [main]
    paths: ['guidebooks/**']
  workflow_dispatch:

jobs:
  redeploy:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger the Vercel deploy hook
        env:
          HOOK: \${{ secrets.VERCEL_DEPLOY_HOOK }}
        run: |
          if [ -z "$HOOK" ]; then
            echo "VERCEL_DEPLOY_HOOK is not set" >&2
            exit 1
          fi
          curl -fsS -X POST "$HOOK" -o /dev/null
          echo "Preview rebuild requested."
`;

function write(relative, contents) {
  const target = path.join(OUT, relative);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, contents);
}

const context = loadGuidebookModules();

fs.rmSync(OUT, { recursive: true, force: true });
write("README.md", README);
write(".github/workflows/redeploy-preview.yml", WORKFLOW);

context.STARTER_TEMPLATES.forEach((guide, index) => {
  const slug = context.SAMPLE_SLUGS[guide.id] || context.slugify(guide.propertyName || guide.title);
  const record = { slug, ...guide };
  delete record.id;
  write(`guidebooks/${String(index + 1).padStart(2, "0")}-${slug}.json`, `${JSON.stringify(record, null, 2)}\n`);
});

console.log(`Scaffolded ${path.relative(process.cwd(), OUT)}:`);
for (const file of fs.readdirSync(path.join(OUT, "guidebooks")).sort()) {
  console.log(`  guidebooks/${file}`);
}
console.log(`
Next steps:

  gh repo create <owner>/guest-guides-data --private
  cd data-repo && git init -b main && git add . && git commit -m "Add guidebook data"
  git remote add origin git@github.com:<owner>/guest-guides-data.git && git push -u origin main
`);
