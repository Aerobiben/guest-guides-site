const assert = require("assert/strict");
const { loadGuidebookModules, guestCss } = require("./lib/guidebooks");

const ctx = loadGuidebookModules();

assert.equal(ctx.safeUrl("javascript:alert(1)"), "");
assert.equal(ctx.safeUrl("JAVASCRIPT:alert(1)"), "");
assert.equal(ctx.safeUrl("data:text/html,<script>alert(1)</script>"), "");
assert.equal(ctx.safeUrl("data:image/svg+xml;base64,PHN2Zy8+", { allowDataImage: true }), "");
assert.equal(ctx.safeUrl("//evil.example/x"), "");
assert.equal(ctx.safeUrl("https://images.unsplash.com/photo-1?auto=format"), "https://images.unsplash.com/photo-1?auto=format");
assert.equal(
  ctx.safeUrl("https://a0.muscache.com/im/pictures/airflow/Hosting-3079929/original/67bf0f10-3eac-4356-8857-fdbb61012dab.jpg?im_w=1200"),
  "https://a0.muscache.com/im/pictures/airflow/Hosting-3079929/original/67bf0f10-3eac-4356-8857-fdbb61012dab.jpg?im_w=1200"
);
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

const autoGuide = {
  ...ctx.STARTER_TEMPLATES[0],
  address: { ...ctx.STARTER_TEMPLATES[0].address, linkBehavior: "automatic" },
};
const addressGuide = {
  ...autoGuide,
  address: { ...autoGuide.address, linkBehavior: "address" },
};
assert.match(ctx.mapsUrl(autoGuide), /37\.7601%2C-122\.5050/);
assert.equal(ctx.mapsUrl(addressGuide).includes("%2C-122.5050"), false);

const clone = ctx.normalizeGuidebook({
  ...ctx.STARTER_TEMPLATES[0],
  demo: false,
  fromSample: true,
  listingUrl: "",
});
assert.equal(clone.demo, false);
assert.equal(clone.fromSample, true);
assert.equal(clone.listingUrl, "");

for (const guide of ctx.STARTER_TEMPLATES) {
  assert.equal(guide.demo, true);
  assert.match(guide.listingUrl, /^https:\/\/www\.airbnb\.com\/rooms\/\d+$/);
  const photoUrls = [
    ...(guide.photos || []).map((photo) => photo.url),
    ...(guide.recommendations || []).map((item) => item.image),
  ].filter(Boolean);
  assert.ok(photoUrls.length > 0, `${guide.id} needs listing photos`);
  for (const url of photoUrls) {
    assert.match(url, /^https:\/\/a0\.muscache\.com\/im\/pictures\//);
  }
}

console.log("security checks passed");
