const STORAGE_KEY = "digital-guidebook-studio-v1";
let guestCssCache = "";
let lastScrolledTab = "";
let state = loadState();

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      if (raw.length > 4_000_000) throw new Error("too large");
      const saved = JSON.parse(raw);
      saved.guides = (saved.guides || []).map((guide, i) => normalizeGuidebook(guide, i));
      if (!saved.guides.length) throw new Error("empty");
      if (!saved.guides.some((guide) => guide.id === saved.activeId)) {
        saved.activeId = saved.guides[0].id;
      }
      saved.tab = typeof saved.tab === "string" ? saved.tab : "intro";
      saved.view = ["editor", "guides", "templates"].includes(saved.view) ? saved.view : "editor";
      return saved;
    }
  } catch {
    /* ignore */
  }
  const first = blankGuidebook();
  return { guides: [first], activeId: first.id, tab: "intro", view: "templates" };
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    console.warn("Guidebook could not be saved in this browser (storage may be full).");
  }
}

function activeGuide() {
  return state.guides.find((guide) => guide.id === state.activeId) || state.guides[0];
}

function setActive(id) {
  state.activeId = id;
  state.view = "editor";
  saveState();
  render();
}

function updateGuide(mutator) {
  const guide = activeGuide();
  mutator(guide);
  saveState();
  schedulePreview();
}

function qs(sel, root = document) {
  return root.querySelector(sel);
}

function qsa(sel, root = document) {
  return [...root.querySelectorAll(sel)];
}

function bindValue(selector, path, kind = "input") {
  const el = qs(selector);
  if (!el) return;
  const guide = activeGuide();
  const parts = path.split(".");
  let cursor = guide;
  for (let i = 0; i < parts.length - 1; i += 1) {
    if (!cursor[parts[i]] || typeof cursor[parts[i]] !== "object") return;
    cursor = cursor[parts[i]];
  }
  const key = parts[parts.length - 1];
  if (el.type === "file") return;
  el.value = cursor[key] ?? "";
  el.oninput = el.onchange = () => {
    cursor[key] = el.value;
    saveState();
    schedulePreview();
    if (path.startsWith("address.")) refreshMap();
    renderHeading();
  };
}

function renderHeading() {
  const guide = activeGuide();
  const place = [guide.address.city, guide.address.country].filter(Boolean).join(", ");
  qs("#guide-title").textContent = guide.propertyName || guide.title || "Untitled guidebook";
  qs("#guide-subtitle").textContent = place
    ? `${place} · edits appear in the phone preview as you type.`
    : "Edit any section. The phone preview updates as you type.";
}

function renderNav() {
  qsa("[data-view]").forEach((btn) => {
    const view = btn.dataset.view;
    const on = view === state.view;
    btn.classList.toggle("is-active", on);
  });
  qsa("[data-section]").forEach((btn) => {
    btn.classList.toggle("is-active", state.view === "editor" && btn.dataset.section === state.tab);
  });
  qsa("[data-tab]").forEach((btn) => {
    const on = btn.dataset.tab === state.tab;
    btn.classList.toggle("is-active", on);
    if (on && state.tab !== lastScrolledTab) {
      const scroller = btn.parentElement;
      if (scroller) {
        const left = Math.max(0, btn.offsetLeft - 16);
        scroller.scrollTo({ left, behavior: "smooth" });
      }
      lastScrolledTab = state.tab;
    }
  });
  qsa(".panel").forEach((panel) => {
    panel.classList.toggle("is-active", panel.dataset.panel === state.tab);
  });
  qs("#guides-panel").classList.toggle("hidden", state.view !== "guides");
  qs("#templates-panel").classList.toggle("hidden", state.view !== "templates");
  qs("#editor-panel").classList.toggle("hidden", state.view !== "editor");
}

function renderGuides() {
  const list = qs("#guides-list");
  list.innerHTML = state.guides.map((guide) => `
    <div class="guide-chip">
      <div>
        <button class="chip-open" data-open="${escapeHtml(guide.id)}">${escapeHtml(guide.propertyName || guide.title)}</button>
        <p class="hint">${escapeHtml(guide.address.city || "No location yet")} · ${guide.photos.filter((photo) => photo.url).length} photos${guide.fromSample ? " · started from a sample" : ""}</p>
      </div>
      <button class="text-btn" data-delete="${escapeHtml(guide.id)}" ${state.guides.length === 1 ? "disabled" : ""}>Delete</button>
    </div>
  `).join("");
  list.querySelectorAll("[data-open]").forEach((btn) => {
    btn.onclick = () => setActive(btn.dataset.open);
  });
  list.querySelectorAll("[data-delete]").forEach((btn) => {
    btn.onclick = () => {
      if (state.guides.length === 1) return;
      const target = state.guides.find((guide) => guide.id === btn.dataset.delete);
      const name = target?.propertyName || target?.title || "this guidebook";
      if (!window.confirm(`Delete “${name}”? This only removes the draft saved in this browser.`)) return;
      state.guides = state.guides.filter((guide) => guide.id !== btn.dataset.delete);
      if (!state.guides.some((guide) => guide.id === state.activeId)) state.activeId = state.guides[0].id;
      saveState();
      render();
    };
  });
}

function renderTemplates() {
  const list = qs("#templates-list");
  list.innerHTML = STARTER_TEMPLATES.map((tpl) => `
    <div class="guide-chip">
      <div>
        <strong>${escapeHtml(tpl.title)}</strong>
        <p class="hint">${escapeHtml([tpl.address.city, tpl.address.country].filter(Boolean).join(", "))} · fictional sample</p>
      </div>
      <button class="add-btn" data-use="${escapeHtml(tpl.id)}">Start from this</button>
    </div>
  `).join("");
  list.querySelectorAll("[data-use]").forEach((btn) => {
    btn.onclick = () => {
      const tpl = STARTER_TEMPLATES.find((item) => item.id === btn.dataset.use);
      const copy = structuredClone(tpl);
      copy.id = makeId();
      copy.demo = false;
      copy.fromSample = true;
      copy.listingUrl = "";
      if (state.guides.length === 1 && isUnusedBlank(state.guides[0])) {
        state.guides = [copy];
      } else {
        state.guides.unshift(copy);
      }
      state.activeId = copy.id;
      state.view = "editor";
      saveState();
      render();
    };
  });
}

function renderPhotos() {
  const list = qs("#photo-list");
  const guide = activeGuide();
  list.innerHTML = guide.photos.map((photo, index) => `
    <div class="photo-row">
      <img ${photo.url ? `src="${attrUrl(photo.url, { allowDataImage: true })}"` : ""} alt="" width="92" height="92" decoding="async" />
      <div class="stack">
        <input class="input" data-photo-url="${escapeHtml(photo.id)}" placeholder="${index === 0 ? "Hero photo URL" : "Photo URL"}" value="${escapeHtml(photo.url)}" />
        <input class="input" data-photo-caption="${escapeHtml(photo.id)}" placeholder="Caption" value="${escapeHtml(photo.caption || "")}" />
        <input type="file" accept="image/png,image/jpeg,image/webp,image/gif,image/avif" data-photo-file="${escapeHtml(photo.id)}" />
      </div>
      <button class="text-btn" data-photo-remove="${escapeHtml(photo.id)}" ${guide.photos.length === 1 ? "disabled" : ""}>Remove</button>
    </div>
  `).join("");
  list.querySelectorAll("[data-photo-url]").forEach((el) => {
    el.oninput = () => {
      const photo = guide.photos.find((item) => item.id === el.dataset.photoUrl);
      if (!photo) return;
      photo.url = el.value;
      saveState();
      schedulePreview();
    };
  });
  list.querySelectorAll("[data-photo-caption]").forEach((el) => {
    el.oninput = () => {
      const photo = guide.photos.find((item) => item.id === el.dataset.photoCaption);
      if (!photo) return;
      photo.caption = el.value;
      saveState();
      schedulePreview();
    };
  });
  list.querySelectorAll("[data-photo-file]").forEach((el) => {
    el.onchange = () => {
      const file = el.files?.[0];
      if (!file) return;
      const type = String(file.type || "").toLowerCase();
      if (!/^image\/(png|jpe?g|gif|webp|avif)$/.test(type)) {
        el.value = "";
        window.alert("Please use a JPG, PNG, WebP, GIF, or AVIF photo.");
        return;
      }
      if (file.size > 1_200_000) {
        el.value = "";
        window.alert("Please use a photo under 1.2 MB, or paste an image URL instead.");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const photo = guide.photos.find((item) => item.id === el.dataset.photoFile);
        if (!photo) return;
        photo.url = String(reader.result);
        saveState();
        render();
      };
      reader.readAsDataURL(file);
    };
  });
  list.querySelectorAll("[data-photo-remove]").forEach((el) => {
    el.onclick = () => {
      guide.photos = guide.photos.filter((item) => item.id !== el.dataset.photoRemove);
      saveState();
      render();
    };
  });
}

function renderRepeat(kind) {
  const guide = activeGuide();
  if (kind === "manual") {
    const list = qs("#manual-list");
    list.innerHTML = guide.houseManual.map((item) => `
      <div class="repeat-row repeat-row-plain">
        <div class="stack">
          <input class="input" data-hm-title="${escapeHtml(item.id)}" placeholder="Title, e.g. Heat &amp; lights" value="${escapeHtml(item.title)}" />
          <textarea data-hm-body="${escapeHtml(item.id)}" placeholder="How it works">${escapeHtml(item.body)}</textarea>
        </div>
        <button class="text-btn" data-hm-remove="${escapeHtml(item.id)}">Remove</button>
      </div>
    `).join("");
    list.querySelectorAll("[data-hm-title]").forEach((el) => {
      el.oninput = () => {
        const item = guide.houseManual.find((entry) => entry.id === el.dataset.hmTitle);
        if (!item) return;
        item.title = el.value;
        saveState();
        schedulePreview();
      };
    });
    list.querySelectorAll("[data-hm-body]").forEach((el) => {
      el.oninput = () => {
        const item = guide.houseManual.find((entry) => entry.id === el.dataset.hmBody);
        if (!item) return;
        item.body = el.value;
        saveState();
        schedulePreview();
      };
    });
    list.querySelectorAll("[data-hm-remove]").forEach((el) => {
      el.onclick = () => {
        guide.houseManual = guide.houseManual.filter((item) => item.id !== el.dataset.hmRemove);
        saveState();
        render();
      };
    });
  }
  if (kind === "recs") {
    const list = qs("#rec-list");
    list.innerHTML = guide.recommendations.map((item) => `
      <div class="repeat-row">
        <img ${item.image ? `src="${attrUrl(item.image, { allowDataImage: true })}"` : ""} alt="" width="92" height="92" decoding="async" />
        <div class="stack">
          <input class="input" data-rec-name="${escapeHtml(item.id)}" placeholder="Name" value="${escapeHtml(item.name)}" />
          <input class="input" data-rec-cat="${escapeHtml(item.id)}" placeholder="Category, e.g. Coffee" value="${escapeHtml(item.category || "")}" />
          <textarea data-rec-notes="${escapeHtml(item.id)}" placeholder="Why you send guests there">${escapeHtml(item.notes)}</textarea>
          <input class="input" data-rec-url="${escapeHtml(item.id)}" placeholder="Link" value="${escapeHtml(item.url || "")}" />
          <input class="input" data-rec-image="${escapeHtml(item.id)}" placeholder="Image URL" value="${escapeHtml(item.image || "")}" />
        </div>
        <button class="text-btn" data-rec-remove="${escapeHtml(item.id)}">Remove</button>
      </div>
    `).join("");
    const bind = (attr, field) => {
      list.querySelectorAll(`[${attr}]`).forEach((el) => {
        el.oninput = () => {
          const rec = guide.recommendations.find((item) => item.id === el.getAttribute(attr));
          if (!rec) return;
          rec[field] = el.value;
          saveState();
          schedulePreview();
        };
      });
    };
    bind("data-rec-name", "name");
    bind("data-rec-cat", "category");
    bind("data-rec-notes", "notes");
    bind("data-rec-url", "url");
    bind("data-rec-image", "image");
    list.querySelectorAll("[data-rec-remove]").forEach((el) => {
      el.onclick = () => {
        guide.recommendations = guide.recommendations.filter((item) => item.id !== el.dataset.recRemove);
        saveState();
        render();
      };
    });
  }
  if (kind === "rules") {
    qs("#rules-input").value = guide.houseRules.join("\n");
  }
}

function fillForm() {
  const g = activeGuide();
  bindValue("#property-name", "propertyName");
  bindValue("#guest-theme", "theme");
  bindValue("#host-name", "hostName");
  bindValue("#host-phone", "hostPhone");
  bindValue("#host-email", "hostEmail");
  bindValue("#listing-url", "listingUrl");
  bindValue("#welcome", "intro.welcome");
  bindValue("#about", "intro.about");
  bindValue("#address-search", "address.search");
  bindValue("#address-line", "address.line1");
  bindValue("#street-number", "address.streetNumber");
  bindValue("#street-name", "address.streetName");
  bindValue("#city", "address.city");
  bindValue("#state", "address.state");
  bindValue("#postal", "address.postal");
  bindValue("#country", "address.country");
  bindValue("#lat", "address.lat");
  bindValue("#lng", "address.lng");
  bindValue("#link-behavior", "address.linkBehavior");
  bindValue("#wifi-network", "wifi.network");
  bindValue("#wifi-password", "wifi.password");
  bindValue("#wifi-notes", "wifi.notes");
  bindValue("#checkin-time", "checkIn.time");
  bindValue("#access-code", "checkIn.accessCode");
  bindValue("#checkin-notes", "checkIn.instructions");
  bindValue("#checkout-time", "checkOut.time");
  bindValue("#checkout-notes", "checkOut.instructions");
  bindValue("#parking-notes", "parking.notes");
  bindValue("#directions-notes", "directions.notes");
  bindValue("#book-message", "bookAgain.message");
  bindValue("#emergency-number", "emergency.localNumber");
  bindValue("#emergency-notes", "emergency.notes");
  qs("#title-field").value = g.title;
  qs("#title-field").oninput = () => {
    g.title = qs("#title-field").value;
    saveState();
  };
  const listingHint = qs("#listing-hint");
  if (listingHint) {
    listingHint.textContent = isSampleListing(g.listingUrl)
      ? "This is still a sample listing link. Paste your own Airbnb or booking URL before guests use it."
      : "Your Airbnb or booking page. Guests tap this to book again. Leave blank if you do not have one yet.";
  }
  renderSampleBanner();
  qs("#rules-input").oninput = () => {
    g.houseRules = qs("#rules-input").value.split("\n").map((line) => line.trim()).filter(Boolean);
    saveState();
    schedulePreview();
  };
  renderPhotos();
  renderRepeat("manual");
  renderRepeat("recs");
  renderRepeat("rules");
  renderHeading();
  refreshMap();
}

function refreshMap() {
  const frame = qs("#map-frame");
  if (!frame) return;
  frame.src = osmEmbed(activeGuide()) || "about:blank";
}

let searchAbort;
async function searchAddress(query) {
  const box = qs("#search-results");
  if (!query || query.length < 3) {
    box.classList.add("hidden");
    searchAbort?.abort();
    return;
  }
  searchAbort?.abort();
  searchAbort = new AbortController();
  const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=5&q=${encodeURIComponent(query)}`;
  let results;
  try {
    const res = await fetch(url, { headers: { Accept: "application/json" }, signal: searchAbort.signal });
    if (!res.ok) return;
    results = await res.json();
  } catch (error) {
    if (error?.name === "AbortError") return;
    return;
  }
  box.classList.remove("hidden");
  box.innerHTML = `<ul>${results.map((item, i) => `<li data-hit="${i}">${escapeHtml(item.display_name)}</li>`).join("")}</ul>`;
  box.querySelectorAll("[data-hit]").forEach((el) => {
    el.onclick = () => {
      const hit = results[Number(el.dataset.hit)];
      if (!hit) return;
      const g = activeGuide();
      const addr = hit.address || {};
      const parts = hit.display_name.split(",").map((part) => part.trim());
      g.address.search = hit.display_name;
      g.address.line1 = hit.display_name;
      g.address.lat = hit.lat;
      g.address.lng = hit.lon;
      g.address.streetNumber = addr.house_number || g.address.streetNumber;
      g.address.streetName = addr.road || parts[0] || g.address.streetName;
      g.address.city = addr.city || addr.town || addr.village || g.address.city;
      g.address.state = addr.state || g.address.state;
      g.address.postal = addr.postcode || g.address.postal;
      g.address.country = addr.country || g.address.country;
      saveState();
      box.classList.add("hidden");
      render();
    };
  });
}

let previewTimer = 0;
function schedulePreview() {
  clearTimeout(previewTimer);
  previewTimer = setTimeout(renderPreview, 140);
}

function renderPreview() {
  const title = qs(".preview-head h2");
  const copy = qs(".preview-head p");
  if (state.view === "templates") {
    if (title) title.textContent = "Sample preview";
    if (copy) copy.textContent = "A fictional example. Start from a template to edit your own copy.";
    hydrateGuest(qs("#guest-preview"), STARTER_TEMPLATES[0]);
    return;
  }
  if (title) title.textContent = "Guest phone preview";
  if (copy) copy.textContent = "This is the downloaded file — it is not published on this site.";
  hydrateGuest(qs("#guest-preview"), activeGuide());
}

function isUnusedBlank(guide) {
  return Boolean(guide)
    && !guide.fromSample
    && !guide.propertyName
    && !guide.hostName
    && !guide.listingUrl
    && !guide.intro?.welcome
    && !guide.wifi?.network
    && !guide.checkIn?.accessCode
    && !(guide.photos || []).some((photo) => photo.url);
}

function renderSampleBanner() {
  const banner = qs("#sample-banner");
  if (!banner) return;
  banner.classList.toggle("hidden", !activeGuide().fromSample);
}

function showStudioToast(message) {
  const toast = qs("#studio-toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("is-on");
  clearTimeout(showStudioToast.timer);
  showStudioToast.timer = setTimeout(() => toast.classList.remove("is-on"), 4200);
}

function render() {
  renderNav();
  renderGuides();
  renderTemplates();
  if (state.view === "editor") fillForm();
  else renderSampleBanner();
  renderPreview();
}

async function loadGuestCss() {
  const res = await fetch("./css/guest.css");
  guestCssCache = await res.text();
}

async function exportHtml() {
  if (!guestCssCache) await loadGuestCss();
  const html = buildGuestDocument(activeGuide(), guestCssCache);
  downloadTextFile(`${slugify(activeGuide().propertyName || activeGuide().title)}.html`, html);
  showStudioToast("Downloaded to this device. Nothing was published here — send the file or host it yourself.");
}

async function openFullPreview() {
  if (!guestCssCache) await loadGuestCss();
  const html = buildGuestDocument(activeGuide(), guestCssCache);
  const url = URL.createObjectURL(new Blob([html], { type: "text/html;charset=utf-8" }));
  window.open(url, "_blank", "noopener");
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}

function openPreview() {
  const col = qs("#preview-col");
  if (col && window.matchMedia("(max-width: 1080px)").matches) {
    col.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }
  openFullPreview();
}

function wire() {
  qsa("[data-view]").forEach((btn) => {
    btn.onclick = () => {
      state.view = btn.dataset.view;
      saveState();
      render();
    };
  });
  qsa("[data-section], [data-tab]").forEach((btn) => {
    btn.onclick = () => {
      state.view = "editor";
      state.tab = btn.dataset.section || btn.dataset.tab;
      saveState();
      render();
    };
  });
  qs("#checkout-nav").onclick = () => {
    state.view = "editor";
    state.tab = "arrival";
    saveState();
    render();
    qs("#checkout-notes")?.focus();
  };
  qs("#new-guide").onclick = () => {
    const guide = blankGuidebook();
    state.guides.unshift(guide);
    state.activeId = guide.id;
    state.view = "editor";
    saveState();
    render();
  };
  qs("#add-photo").onclick = () => {
    activeGuide().photos.push({ id: makeId("ph"), url: "", caption: "" });
    saveState();
    render();
  };
  qs("#add-manual").onclick = () => {
    activeGuide().houseManual.push({ id: makeId("hm"), title: "", body: "" });
    saveState();
    render();
  };
  qs("#add-rec").onclick = () => {
    activeGuide().recommendations.push({ id: makeId("rec"), name: "", category: "", notes: "", url: "", image: "" });
    saveState();
    render();
  };
  qs("#download-btn").onclick = exportHtml;
  qs("#preview-btn").onclick = openPreview;
  qs("#preview-full-btn").onclick = openFullPreview;
  qs("#dismiss-sample-banner")?.addEventListener("click", () => {
    activeGuide().fromSample = false;
    saveState();
    renderSampleBanner();
  });
  let searchTimer;
  qs("#address-search").addEventListener("input", (event) => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => searchAddress(event.target.value), 350);
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  initTheme("#theme-toggle");
  document.addEventListener("themechange", renderPreview);
  await loadGuestCss();
  wire();
  render();
});
