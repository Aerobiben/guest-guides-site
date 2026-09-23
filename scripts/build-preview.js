const fs = require("fs");
const path = require("path");
const { ROOT, loadGuidebookModules, guestCss } = require("./lib/guidebooks");

const SRC = path.join(ROOT, "preview");
const OUT = path.join(ROOT, "preview-dist");

// Only viewer assets are copied. studio.html, studio.css, studio.js and
// export.js stay out of this bundle so the deployment cannot build anything.
const SHARED = [
  ["css/tokens.css", "css/tokens.css"],
  ["css/guest.css", "css/guest.css"],
  ["js/theme.js", "js/theme.js"],
  ["js/templates.js", "js/templates.js"],
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

fs.rmSync(OUT, { recursive: true, force: true });

for (const [from, to] of SHARED) copy(path.join(ROOT, from), path.join(OUT, to));
for (const [from, to] of LOCAL) copy(path.join(SRC, from), path.join(OUT, to));

const context = loadGuidebookModules();
const css = guestCss();
const guidesDir = path.join(OUT, "guides");
fs.mkdirSync(guidesDir, { recursive: true });

for (const guide of context.STARTER_TEMPLATES) {
  const slug = context.SAMPLE_SLUGS[guide.id];
  if (!slug) continue;
  fs.writeFileSync(path.join(guidesDir, `${slug}.html`), context.buildGuestDocument(guide, css));
}

const shipped = [];
(function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else shipped.push(path.relative(OUT, full));
  }
})(OUT);

const forbidden = shipped.filter((file) => /studio|export/.test(file));
if (forbidden.length) {
  throw new Error(`Builder assets must not ship in the preview bundle: ${forbidden.join(", ")}`);
}

console.log(`preview-dist ready (${shipped.length} files)`);
console.log(shipped.sort().map((file) => `  ${file}`).join("\n"));
