const fs = require("fs");
const path = require("path");
const { ROOT, loadGuidebookModules, guestCss } = require("./lib/guidebooks");

const context = loadGuidebookModules();
const css = guestCss();
const outDir = path.join(ROOT, "samples");
fs.mkdirSync(outDir, { recursive: true });

const files = [
  ["les-lilas.html", context.lesLilasGuidebook()],
  ["mundus-bologna.html", context.mundusGuidebook()],
  ["bnbhost-glasgow.html", context.glasgowGuidebook()],
];

for (const [name, guide] of files) {
  fs.writeFileSync(path.join(outDir, name), context.buildGuestDocument(guide, css));
  console.log("wrote", name);
}
