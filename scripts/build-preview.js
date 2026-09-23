const fs = require("fs");
const path = require("path");
const { ROOT, guestCss } = require("./lib/guidebooks");
const { resolveGuidebooks } = require("./lib/guidebook-data");

const SRC = path.join(ROOT, "preview");
const OUT = path.join(ROOT, "preview-dist");

// Only viewer assets are copied. studio.html, studio.css, studio.js and
// export.js stay out of this bundle so the deployment cannot build anything.
const SHARED = [
  ["css/tokens.css", "css/tokens.css"],
  ["css/guest.css", "css/guest.css"],
  ["js/theme.js", "js/theme.js"],
  ["js/guest-render.js", "js/guest-render.js"],
  ["favicon.svg", "favicon.svg"],
];

const LOCAL = [
  ["index.html", "index.html"],
  ["css/preview.css", "css/preview.css"],
  ["js/preview.js", "js/preview.js"],
  ["robots.txt", "robots.txt"],
];

function copy(from, to) {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);
}

function listFiles(dir) {
  const files = [];
  (function walk(current) {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) walk(full);
      else files.push(path.relative(dir, full));
    }
  })(dir);
  return files.sort();
}

async function main() {
  const { source, guides, context } = await resolveGuidebooks();
  const css = guestCss();

  fs.rmSync(OUT, { recursive: true, force: true });
  for (const [from, to] of SHARED) copy(path.join(ROOT, from), path.join(OUT, to));
  for (const [from, to] of LOCAL) copy(path.join(SRC, from), path.join(OUT, to));

  const guidesDir = path.join(OUT, "guides");
  fs.mkdirSync(guidesDir, { recursive: true });
  const seen = new Set();
  for (const guide of guides) {
    let slug = guide.slug;
    let n = 2;
    while (seen.has(slug)) slug = `${guide.slug}-${n++}`;
    seen.add(slug);
    guide.slug = slug;
    fs.writeFileSync(path.join(guidesDir, `${slug}.html`), context.buildGuestDocument(guide, css));
  }

  fs.mkdirSync(path.join(OUT, "data"), { recursive: true });
  fs.writeFileSync(
    path.join(OUT, "data", "guidebooks.json"),
    JSON.stringify({ generatedAt: new Date().toISOString(), guides }, null, 1)
  );

  const shipped = listFiles(OUT);
  const forbidden = shipped.filter((file) => /studio|export/.test(file));
  if (forbidden.length) {
    throw new Error(`Builder assets must not ship in the preview bundle: ${forbidden.join(", ")}`);
  }

  const html = fs.readFileSync(path.join(OUT, "index.html"), "utf8");
  const missing = [...html.matchAll(/(?:src|href)="\.\/([^"]+)"/g)]
    .map((match) => match[1])
    .filter((asset) => !fs.existsSync(path.join(OUT, asset)));
  if (missing.length) {
    throw new Error(`index.html references files that are not in the bundle: ${missing.join(", ")}`);
  }

  console.log(`preview-dist ready from ${source} — ${guides.length} guides, ${shipped.length} files`);
  console.log(shipped.map((file) => `  ${file}`).join("\n"));
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
