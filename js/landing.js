function renderHeroPreview() {
  const stage = document.querySelector("#hero-preview");
  if (!stage) return;
  hydrateGuest(stage, STARTER_TEMPLATES[0], document.documentElement.dataset.theme);
}

document.addEventListener("DOMContentLoaded", () => {
  initTheme("#theme-toggle");
  document.addEventListener("themechange", renderHeroPreview);
  renderHeroPreview();
});
