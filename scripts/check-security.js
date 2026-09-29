const assert = require("assert/strict");
const { loadGuidebookModules, guestCss } = require("./lib/guidebooks");

const ctx = loadGuidebookModules();

assert.equal(ctx.safeUrl("javascript:alert(1)"), "");
assert.equal(ctx.safeUrl("JAVASCRIPT:alert(1)"), "");
assert.equal(ctx.safeUrl("data:text/html,<script>alert(1)</script>"), "");
assert.equal(ctx.safeUrl("data:image/svg+xml;base64,PHN2Zy8+", { allowDataImage: true }), "");
assert.equal(ctx.safeUrl("//evil.example/x"), "");
assert.equal(ctx.safeUrl("https://images.unsplash.com/photo-1?auto=format"), "https://images.unsplash.com/photo-1?auto=format");
assert.match(ctx.safeUrl("data:image/png;base64,aaaa", { allowDataImage: true }), /^data:image\/png;base64,/);

const payload = "https://example.com/x?</script><script>alert(1)//";
const html = ctx.buildGuestDocument(
  {
    ...ctx.STARTER_TEMPLATES[0],
    photos: [{ id: "ph-x", url: payload, caption: "</script>" }],
  },
  guestCss()
);

assert.equal(html.includes("</script><script>alert"), false);
assert.equal(html.includes("\\u003c/script\\u003e") || html.includes("%3C/script%3E"), true);
assert.match(html, /sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox"/);
assert.match(html, /http-equiv="Content-Security-Policy"/);
assert.equal(ctx.escapeHtml(`"'<>`).includes("<"), false);

console.log("security checks passed");
