const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.join(__dirname, "..", "..");

function loadGuidebookModules(files = ["js/templates.js", "js/guest-render.js", "js/export.js"]) {
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
  for (const file of files) {
    vm.runInContext(fs.readFileSync(path.join(ROOT, file), "utf8"), context);
  }
  return context;
}

function guestCss() {
  return fs.readFileSync(path.join(ROOT, "css/guest.css"), "utf8");
}

module.exports = { ROOT, loadGuidebookModules, guestCss };
