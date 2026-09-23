const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.join(__dirname, "..");
const context = {
  console,
  JSON,
  Math,
  Number,
  String,
  encodeURIComponent,
};
context.globalThis = context;
vm.createContext(context);
for (const file of ["js/templates.js", "js/guest-render.js", "js/export.js"]) {
  vm.runInContext(fs.readFileSync(path.join(root, file), "utf8"), context);
}
const css = fs.readFileSync(path.join(root, "css/guest.css"), "utf8");
const outDir = path.join(root, "samples");
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
