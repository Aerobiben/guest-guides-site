const fs = require("fs");
const path = require("path");
const { ROOT, loadGuidebookModules, guestCss } = require("./lib/guidebooks");

const context = loadGuidebookModules();
const css = guestCss();
const outDir = path.join(ROOT, "samples");
fs.mkdirSync(outDir, { recursive: true });

for (const guide of context.STARTER_TEMPLATES) {
  const slug = context.SAMPLE_SLUGS[guide.id] || context.slugify(guide.propertyName || guide.title);
  const name = `${slug}.html`;
  fs.writeFileSync(path.join(outDir, name), context.buildGuestDocument(guide, css));
  console.log("wrote", name);
}
