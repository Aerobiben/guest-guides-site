const GALLERY = STARTER_TEMPLATES.map((guide) => ({
  guide,
  slug: SAMPLE_SLUGS[guide.id] || "",
}));

let activeIndex = 0;

function heroPhoto(guide) {
  return (guide.photos || []).find((photo) => photo.url)?.url || "";
}

function place(guide) {
  return [guide.address.city, guide.address.country].filter(Boolean).join(", ") || "Somewhere lovely";
}

function icon(path) {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">${path}</svg>`;
}

function renderPicker() {
  const list = document.querySelector("#guide-picker");
  list.innerHTML = GALLERY.map((entry, index) => `
    <button class="guide-option ${index === activeIndex ? "is-active" : ""}" type="button" data-index="${index}">
      <img src="${escapeHtml(heroPhoto(entry.guide))}" alt="" loading="lazy" />
      <span>
        <strong>${escapeHtml(entry.guide.propertyName || entry.guide.title)}</strong>
        <span>${escapeHtml(place(entry.guide))}</span>
      </span>
    </button>
  `).join("");
  list.querySelectorAll("[data-index]").forEach((btn) => {
    btn.onclick = () => {
      activeIndex = Number(btn.dataset.index);
      render();
    };
  });
}

function renderFacts(guide) {
  const rows = [
    guide.wifi.network && ["Wi‑Fi", guide.wifi.network, '<path d="M3.5 9.5a13 13 0 0 1 17 0M6.8 13a8.5 8.5 0 0 1 10.4 0M10 16.4a3.6 3.6 0 0 1 4 0"/><circle cx="12" cy="19.4" r="1"/>'],
    guide.checkIn.time && ["Check-in", `From ${guide.checkIn.time}`, '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 1.8"/>'],
    guide.checkOut.time && ["Checkout", `By ${guide.checkOut.time}`, '<path d="M10 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4m4-12 4 4-4 4m4-4H10"/>'],
    ["Sections", `${countSections(guide)} on the phone`, '<rect x="5" y="3.5" width="14" height="17" rx="2.5"/><path d="M9 8h6M9 12h6M9 16h3"/>'],
    ["Photos", `${(guide.photos || []).filter((photo) => photo.url).length} in the gallery`, '<rect x="3.5" y="5.5" width="17" height="13" rx="2.5"/><circle cx="9" cy="10.5" r="1.6"/><path d="m4.5 16 4.2-3.6 3.3 2.8 3-2.4 4.5 3.7"/>'],
  ].filter(Boolean);

  document.querySelector("#fact-list").innerHTML = rows.map(([label, value, path]) => `
    <li>
      <i>${icon(path)}</i>
      <span>${escapeHtml(label)}<small>${escapeHtml(value)}</small></span>
    </li>
  `).join("");
}

function countSections(guide) {
  let count = 4;
  if (guide.wifi.network || guide.wifi.password) count += 1;
  if ((guide.recommendations || []).length) count += 1;
  if ((guide.houseManual || []).length || (guide.houseRules || []).length) count += 1;
  return count;
}

function render() {
  const { guide, slug } = GALLERY[activeIndex];
  renderPicker();
  renderFacts(guide);
  document.querySelector("#stage-title").textContent = guide.propertyName || guide.title;
  document.querySelector("#stage-meta").textContent = `${place(guide)} · hosted by ${guide.hostName || "your host"}`;
  const link = document.querySelector("#fullscreen-link");
  link.classList.toggle("hidden", !slug);
  if (slug) link.href = `./guides/${slug}.html`;
  hydrateGuest(document.querySelector("#guest-preview"), guide, document.documentElement.dataset.theme);
}

document.addEventListener("DOMContentLoaded", () => {
  initTheme("#theme-toggle");
  document.addEventListener("themechange", render);
  render();
});
