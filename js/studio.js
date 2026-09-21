const STORAGE_KEY = "digital-guidebook-studio-v1";
let guestCssCache = "";
let state = loadState();

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      saved.guides = saved.guides.map((guide) => ({ ...blankGuidebook(), ...guide, id: guide.id }));
      return saved;
    }
  } catch {
    /* ignore */
  }
  const first = structuredClone(STARTER_TEMPLATES[0]);
  return { guides: [first], activeId: first.id, tab: "intro", view: "editor" };
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
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
  renderPreview();
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
  for (let i = 0; i < parts.length - 1; i += 1) cursor = cursor[parts[i]];
  const key = parts[parts.length - 1];
  if (el.type === "file") return;
  el.value = cursor[key] ?? "";
  el.oninput = el.onchange = () => {
    cursor[key] = el.value;
    saveState();
    renderPreview();
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
    const on = view === state.view || (view === "guides" && state.view === "editor");
    btn.classList.toggle("is-active", on);
  });
  qsa("[data-section]").forEach((btn) => {
    btn.classList.toggle("is-active", state.view === "editor" && btn.dataset.section === state.tab);
  });
  qsa("[data-tab]").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.tab === state.tab);
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
        <button class="chip-open" data-open="${guide.id}">${escapeHtml(guide.propertyName || guide.title)}</button>
        <p class="hint">${escapeHtml(guide.address.city || "No location yet")} · ${guide.photos.filter((photo) => photo.url).length} photos</p>
      </div>
      <button class="text-btn" data-delete="${guide.id}" ${state.guides.length === 1 ? "disabled" : ""}>Delete</button>
    </div>
  `).join("");
  list.querySelectorAll("[data-open]").forEach((btn) => {
    btn.onclick = () => setActive(btn.dataset.open);
  });
  list.querySelectorAll("[data-delete]").forEach((btn) => {
    btn.onclick = () => {
      if (state.guides.length === 1) return;
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
        <p class="hint">${escapeHtml([tpl.address.city, tpl.address.country].filter(Boolean).join(", "))}</p>
      </div>
      <button class="add-btn" data-use="${tpl.id}">Use template</button>
    </div>
  `).join("");
  list.querySelectorAll("[data-use]").forEach((btn) => {
    btn.onclick = () => {
      const tpl = STARTER_TEMPLATES.find((item) => item.id === btn.dataset.use);
      const copy = structuredClone(tpl);
      copy.id = makeId();
      state.guides.unshift(copy);
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
      <img src="${escapeHtml(photo.url)}" alt="" />
      <div class="stack">
        <input class="input" data-photo-url="${photo.id}" placeholder="${index === 0 ? "Hero photo URL" : "Photo URL"}" value="${escapeHtml(photo.url)}" />
        <input class="input" data-photo-caption="${photo.id}" placeholder="Caption" value="${escapeHtml(photo.caption || "")}" />
        <input type="file" accept="image/*" data-photo-file="${photo.id}" />
      </div>
      <button class="text-btn" data-photo-remove="${photo.id}" ${guide.photos.length === 1 ? "disabled" : ""}>Remove</button>
    </div>
  `).join("");
  list.querySelectorAll("[data-photo-url]").forEach((el) => {
    el.oninput = () => {
      const photo = guide.photos.find((item) => item.id === el.dataset.photoUrl);
      photo.url = el.value;
      saveState();
      renderPreview();
    };
  });
  list.querySelectorAll("[data-photo-caption]").forEach((el) => {
    el.oninput = () => {
      const photo = guide.photos.find((item) => item.id === el.dataset.photoCaption);
      photo.caption = el.value;
      saveState();
      renderPreview();
    };
  });
  list.querySelectorAll("[data-photo-file]").forEach((el) => {
    el.onchange = () => {
      const file = el.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const photo = guide.photos.find((item) => item.id === el.dataset.photoFile);
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
          <input class="input" data-hm-title="${item.id}" placeholder="Title, e.g. Heat &amp; lights" value="${escapeHtml(item.title)}" />
          <textarea data-hm-body="${item.id}" placeholder="How it works">${escapeHtml(item.body)}</textarea>
        </div>
        <button class="text-btn" data-hm-remove="${item.id}">Remove</button>
      </div>
    `).join("");
    list.querySelectorAll("[data-hm-title]").forEach((el) => {
      el.oninput = () => {
        guide.houseManual.find((item) => item.id === el.dataset.hmTitle).title = el.value;
        saveState();
        renderPreview();
      };
    });
    list.querySelectorAll("[data-hm-body]").forEach((el) => {
      el.oninput = () => {
        guide.houseManual.find((item) => item.id === el.dataset.hmBody).body = el.value;
        saveState();
        renderPreview();
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
        <img src="${escapeHtml(item.image || "")}" alt="" />
        <div class="stack">
          <input class="input" data-rec-name="${item.id}" placeholder="Name" value="${escapeHtml(item.name)}" />
          <input class="input" data-rec-cat="${item.id}" placeholder="Category, e.g. Coffee" value="${escapeHtml(item.category || "")}" />
          <textarea data-rec-notes="${item.id}" placeholder="Why you send guests there">${escapeHtml(item.notes)}</textarea>
          <input class="input" data-rec-url="${item.id}" placeholder="Link" value="${escapeHtml(item.url || "")}" />
          <input class="input" data-rec-image="${item.id}" placeholder="Image URL" value="${escapeHtml(item.image || "")}" />
        </div>
        <button class="text-btn" data-rec-remove="${item.id}">Remove</button>
      </div>
    `).join("");
    const bind = (attr, field) => {
      list.querySelectorAll(`[${attr}]`).forEach((el) => {
        el.oninput = () => {
          const rec = guide.recommendations.find((item) => item.id === el.getAttribute(attr));
          rec[field] = el.value;
          saveState();
          renderPreview();
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
  qs("#rules-input").oninput = () => {
    g.houseRules = qs("#rules-input").value.split("\n").map((line) => line.trim()).filter(Boolean);
    saveState();
    renderPreview();
  };
  renderPhotos();
  renderRepeat("manual");
  renderRepeat("recs");
  renderRepeat("rules");
  renderHeading();
  refreshMap();
}

function refreshMap() {
  qs("#map-frame").src = osmEmbed(activeGuide());
}

async function searchAddress(query) {
  const box = qs("#search-results");
  if (!query || query.length < 3) {
    box.classList.add("hidden");
    return;
  }
  const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5&q=${encodeURIComponent(query)}`;
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) return;
  const results = await res.json();
  box.classList.remove("hidden");
  box.innerHTML = `<ul>${results.map((item, i) => `<li data-hit="${i}">${escapeHtml(item.display_name)}</li>`).join("")}</ul>`;
  box.querySelectorAll("[data-hit]").forEach((el) => {
    el.onclick = () => {
      const hit = results[Number(el.dataset.hit)];
      const g = activeGuide();
      g.address.search = hit.display_name;
      g.address.line1 = hit.display_name;
      g.address.lat = hit.lat;
      g.address.lng = hit.lon;
      const parts = hit.display_name.split(",").map((part) => part.trim());
      g.address.streetName = parts[0] || g.address.streetName;
      g.address.city = hit.address?.city || parts[1] || g.address.city;
      saveState();
      box.classList.add("hidden");
      render();
    };
  });
}

function renderPreview() {
  hydrateGuest(qs("#guest-preview"), activeGuide(), document.documentElement.dataset.theme);
}

function render() {
  renderNav();
  renderGuides();
  renderTemplates();
  if (state.view === "editor") fillForm();
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
}

async function openPreview() {
  if (!guestCssCache) await loadGuestCss();
  const html = buildGuestDocument(activeGuide(), guestCssCache);
  const url = URL.createObjectURL(new Blob([html], { type: "text/html;charset=utf-8" }));
  window.open(url, "_blank", "noopener");
  setTimeout(() => URL.revokeObjectURL(url), 30000);
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
