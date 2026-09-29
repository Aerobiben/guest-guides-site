function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const SAFE_DATA_IMAGE = /^data:image\/(png|jpe?g|gif|webp|avif);base64,/i;

function safeUrl(value, { allowDataImage = false, allowTel = false, allowHash = true } = {}) {
  const raw = String(value ?? "").trim();
  if (!raw || raw.length > 2_000_000) return "";
  if (raw.startsWith("//")) return "";
  if (allowHash && raw.startsWith("#") && !raw.includes(":")) return raw;
  if (allowDataImage && SAFE_DATA_IMAGE.test(raw)) return raw;
  try {
    const url = new URL(raw);
    const protocol = url.protocol.toLowerCase();
    if (protocol === "http:" || protocol === "https:") return url.href;
    if (allowTel && protocol === "tel:") return raw;
  } catch {
    /* ignore */
  }
  return "";
}

function jsonForScript(value) {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

function attrUrl(value, options) {
  return escapeHtml(safeUrl(value, options));
}

function copyControl(value, label = "Copy", done = "Copied") {
  if (!value) return "";
  return `<button class="guest-copy" type="button" data-copy="${escapeHtml(value)}" data-copied="${escapeHtml(done)}">${escapeHtml(label)}</button>`;
}

function mapsUrl(guidebook) {
  const { address } = guidebook;
  if (address.linkBehavior === "latlng" && validCoords(guidebook)) {
    return `https://www.google.com/maps?q=${encodeURIComponent(`${address.lat},${address.lng}`)}`;
  }
  const query = fullAddress(guidebook);
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}`;
}

function fullAddress(guidebook) {
  const a = guidebook.address || {};
  return [a.line1, a.streetNumber, a.streetName, a.city, a.state, a.postal, a.country]
    .filter(Boolean)
    .filter((part, index, arr) => arr.indexOf(part) === index)
    .join(", ");
}

function validCoords(guidebook) {
  const lat = Number(guidebook.address?.lat);
  const lng = Number(guidebook.address?.lng);
  return Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180;
}

function osmEmbed(guidebook) {
  if (!validCoords(guidebook)) return "";
  const lat = Number(guidebook.address.lat);
  const lng = Number(guidebook.address.lng);
  const d = 0.01;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${lng - d}%2C${lat - d}%2C${lng + d}%2C${lat + d}&layer=mapnik&marker=${lat}%2C${lng}`;
}

function phoneHref(phone) {
  const cleaned = String(phone).replace(/[^\d+]/g, "");
  return cleaned ? `tel:${cleaned}` : "";
}

function copyText(text) {
  const value = String(text ?? "");
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(value).then(() => true).catch(() => fallbackCopy(value));
  }
  return Promise.resolve(fallbackCopy(value));
}

function fallbackCopy(text) {
  const field = document.createElement("textarea");
  field.value = text;
  field.setAttribute("readonly", "");
  field.style.position = "fixed";
  field.style.left = "-9999px";
  document.body.appendChild(field);
  field.select();
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  }
  field.remove();
  return ok;
}

function renderGuestInner(guidebook) {
  const photos = (guidebook.photos || []).filter((photo) => safeUrl(photo.url, { allowDataImage: true }));
  const hero = photos[0];
  const rest = photos.slice(1, 5);
  const recs = guidebook.recommendations || [];
  const manuals = guidebook.houseManual || [];
  const rules = guidebook.houseRules || [];
  const wifi = guidebook.wifi || {};
  const checkIn = guidebook.checkIn || {};
  const checkOut = guidebook.checkOut || {};
  const parking = guidebook.parking || {};
  const directions = guidebook.directions || {};
  const bookAgain = guidebook.bookAgain || {};
  const emergency = guidebook.emergency || {};
  const hasWifi = wifi.network || wifi.password;
  const hasAddress = fullAddress(guidebook);
  const mapSrc = osmEmbed(guidebook);
  const listingHref = attrUrl(guidebook.listingUrl);
  const hostTel = phoneHref(guidebook.hostPhone);

  return `
    <div class="guest-shell">
      <section class="guest-hero" data-hero>
        ${hero ? `<img class="guest-hero-photo" src="${attrUrl(hero.url, { allowDataImage: true })}" alt="${escapeHtml(hero.caption || guidebook.propertyName || "")}" width="800" height="330" decoding="async" />` : ""}
        <button class="guest-theme-toggle" type="button" data-theme-toggle aria-label="Toggle dark mode">
          <svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
            <circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2.5 12h2M19.5 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/>
          </svg>
          <svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
            <path d="M20 14.2A8.2 8.2 0 0 1 9.8 4a8.4 8.4 0 1 0 10.2 10.2Z"/>
          </svg>
        </button>
        <div class="guest-hero-copy">
          <p>${escapeHtml(guidebook.hostName || "Your host")}</p>
          <h1>${escapeHtml(guidebook.propertyName || guidebook.title || "Guest guide")}</h1>
          <div class="guest-dots">${photos.map((_, i) => `<button type="button" data-photo="${i}" class="${i === 0 ? "is-on" : ""}" aria-label="Photo ${i + 1} of ${photos.length}"></button>`).join("")}</div>
        </div>
      </section>
      <div class="guest-body">
        <p class="guest-welcome">${escapeHtml((guidebook.intro || {}).welcome || "Welcome. This guide has everything you need for the stay.")}</p>
        <p class="guest-about ${(guidebook.intro || {}).about ? "" : "guest-hidden"}">${escapeHtml((guidebook.intro || {}).about)}</p>
        <div class="guest-gallery ${rest.length ? "" : "guest-hidden"}">
          ${rest.map((photo, i) => `
            <button class="guest-gallery-shot" type="button" data-photo="${i + 1}" aria-label="Show photo ${i + 2} of ${photos.length}">
              <img src="${attrUrl(photo.url, { allowDataImage: true })}" alt="${escapeHtml(photo.caption || guidebook.propertyName)}" width="400" height="124" loading="lazy" decoding="async" />
            </button>`).join("")}
        </div>
        <div class="guest-actions">
          <a href="${hasWifi ? "#wifi" : "#checkin"}"><strong>Wi‑Fi</strong><span>${escapeHtml(wifi.network || "Details inside")}</span></a>
          <a href="#checkin"><strong>Check-in</strong><span>${escapeHtml(checkIn.time || "See notes")}</span></a>
          <a href="${escapeHtml(mapsUrl(guidebook))}" target="_blank" rel="noopener noreferrer"><strong>Map</strong><span>${escapeHtml((guidebook.address || {}).city || "Directions")}</span></a>
          <a href="${hostTel ? escapeHtml(hostTel) : "#book"}"><strong>Host</strong><span>${escapeHtml(guidebook.hostPhone || guidebook.hostName || "Message us")}</span></a>
        </div>

        <article class="guest-card ${hasWifi ? "" : "guest-hidden"}" id="wifi">
          <h2>Wi‑Fi</h2>
          <div class="guest-wifi"><div>Network</div><div><strong>${escapeHtml(wifi.network)}</strong> ${copyControl(wifi.network)}</div></div>
          <div class="guest-wifi"><div>Password</div><div><strong>${escapeHtml(wifi.password)}</strong> ${copyControl(wifi.password)}</div></div>
          ${wifi.network && wifi.password ? `<p>${copyControl(`${wifi.network}\n${wifi.password}`, "Copy both", "Wi‑Fi copied")}</p>` : ""}
          ${wifi.notes ? `<p>${escapeHtml(wifi.notes)}</p>` : ""}
        </article>

        <article class="guest-card" id="checkin">
          <h2>Check-in</h2>
          <p>From <strong>${escapeHtml(checkIn.time || "—")}</strong>${checkIn.accessCode ? ` · Door code <strong>${escapeHtml(checkIn.accessCode)}</strong> ${copyControl(checkIn.accessCode, "Copy code", "Code copied")}` : ""}</p>
          ${checkIn.instructions ? `<p>${escapeHtml(checkIn.instructions)}</p>` : ""}
        </article>

        <article class="guest-card" id="directions">
          <h2>Directions</h2>
          ${hasAddress ? `<p>${escapeHtml(hasAddress)}</p>` : ""}
          ${directions.notes ? `<p>${escapeHtml(directions.notes)}</p>` : ""}
          ${mapSrc ? `<iframe class="guest-map" title="Map" src="${escapeHtml(mapSrc)}" loading="lazy" referrerpolicy="no-referrer" sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox"></iframe>` : ""}
        </article>

        <article class="guest-card ${parking.notes ? "" : "guest-hidden"}" id="parking">
          <h2>Parking</h2>
          <p>${escapeHtml(parking.notes)}</p>
        </article>

        <article class="guest-card" id="house">
          <h2>House manual</h2>
          ${manuals.map((item) => `<p><strong>${escapeHtml(item.title)}</strong><br />${escapeHtml(item.body)}</p>`).join("") || "<p>Make yourself at home. Text us if anything is unclear.</p>"}
          ${rules.length ? `<ul>${rules.map((rule) => `<li>${escapeHtml(rule)}</li>`).join("")}</ul>` : ""}
        </article>

        <article class="guest-card ${recs.length ? "" : "guest-hidden"}" id="recs">
          <h2>Recommendations</h2>
          ${recs.map((rec) => {
            const href = attrUrl(rec.url) || mapsUrl(guidebook);
            const image = attrUrl(rec.image, { allowDataImage: true });
            return `
            <a class="guest-rec" href="${href}" target="_blank" rel="noopener noreferrer">
              ${image ? `<img src="${image}" alt="${escapeHtml(rec.name)}" width="92" height="92" loading="lazy" decoding="async" />` : "<div></div>"}
              <div>
                <small>${escapeHtml(rec.category || "Nearby")}</small>
                <p><strong>${escapeHtml(rec.name)}</strong></p>
                <p>${escapeHtml(rec.notes)}</p>
              </div>
            </a>`;
          }).join("")}
        </article>

        <article class="guest-card" id="checkout">
          <h2>Checkout</h2>
          <p>By <strong>${escapeHtml(checkOut.time || "—")}</strong></p>
          <p>${escapeHtml(checkOut.instructions)}</p>
        </article>

        <article class="guest-card" id="book">
          <h2>Book again</h2>
          <p>${escapeHtml(bookAgain.message)}</p>
          ${listingHref ? `<p><a href="${listingHref}" target="_blank" rel="noopener noreferrer">Open the listing</a></p>` : ""}
          <p>Emergency: ${escapeHtml(emergency.localNumber || "local emergency services")}. ${escapeHtml(emergency.notes)}</p>
        </article>
      </div>
      <nav class="guest-nav">
        ${hasWifi ? `<a href="#wifi">Wi‑Fi</a>` : ""}
        <a href="#checkin">Check-in</a>
        <a href="#directions">Map</a>
        ${parking.notes ? `<a href="#parking">Parking</a>` : ""}
        <a href="#house">House</a>
        ${recs.length ? `<a href="#recs">Eats</a>` : ""}
        <a href="#checkout">Out</a>
      </nav>
      <div class="guest-toast" data-toast role="status" aria-live="polite">Copied</div>
    </div>
  `;
}

function bindGuestInteractions(root, photos, options = {}) {
  const list = (photos || []).filter(Boolean);
  let index = Math.max(0, Math.min(Number(options.startIndex) || 0, Math.max(0, list.length - 1)));
  const hero = root.querySelector("[data-hero]");

  function showPhoto(next) {
    if (!list.length || !hero) return;
    index = ((next % list.length) + list.length) % list.length;
    let img = hero.querySelector(".guest-hero-photo");
    if (!img) {
      img = document.createElement("img");
      img.className = "guest-hero-photo";
      img.alt = "";
      img.width = 800;
      img.height = 330;
      img.decoding = "async";
      hero.insertBefore(img, hero.firstChild);
    }
    img.src = list[index];
    root.querySelectorAll("[data-photo]").forEach((el) => {
      el.classList.toggle("is-on", Number(el.getAttribute("data-photo")) === index);
    });
    if (root.dataset) root.dataset.previewPhoto = String(index);
  }

  root.querySelectorAll("[data-photo]").forEach((btn) => {
    btn.addEventListener("click", () => showPhoto(Number(btn.getAttribute("data-photo"))));
  });

  if (hero && list.length > 1) {
    let startX = 0;
    let tracking = false;
    hero.addEventListener("pointerdown", (event) => {
      if (event.target.closest("button")) return;
      tracking = true;
      startX = event.clientX;
    });
    hero.addEventListener("pointerup", (event) => {
      if (!tracking) return;
      tracking = false;
      const dx = event.clientX - startX;
      if (Math.abs(dx) < 48) return;
      showPhoto(index + (dx < 0 ? 1 : -1));
    });
    hero.addEventListener("keydown", (event) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        showPhoto(index + 1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        showPhoto(index - 1);
      }
    });
    hero.setAttribute("tabindex", "0");
    hero.setAttribute("role", "region");
    hero.setAttribute("aria-label", "Stay photos");
  }

  if (index > 0) showPhoto(index);

  const toast = root.querySelector("[data-toast]");
  root.querySelectorAll("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", () => {
      copyText(btn.getAttribute("data-copy") || "").then((ok) => {
        if (!toast) return;
        toast.textContent = ok ? (btn.getAttribute("data-copied") || "Copied") : "Copy failed";
        toast.classList.add("is-on");
        setTimeout(() => toast.classList.remove("is-on"), 1400);
      });
    });
  });

  const navLinks = [...root.querySelectorAll(".guest-nav a[href^='#']")];
  const overflowY = root.classList.contains("guest-app") ? getComputedStyle(root).overflowY : "";
  const observerRoot = overflowY === "auto" || overflowY === "scroll" ? root : null;
  const sections = navLinks
    .map((link) => root.querySelector(link.getAttribute("href")))
    .filter(Boolean);
  if (sections.length && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      navLinks.forEach((link) => {
        link.classList.toggle("is-on", link.getAttribute("href") === `#${visible.target.id}`);
      });
    }, { root: observerRoot, rootMargin: "-10% 0px -58% 0px", threshold: [0, 0.2, 0.55] });
    sections.forEach((section) => observer.observe(section));
  }

  if (typeof options.onThemeToggle === "function") {
    const toggle = root.querySelector("[data-theme-toggle]");
    if (toggle) toggle.addEventListener("click", options.onThemeToggle);
  }
}

function guestPageScript() {
  return `
    ${fallbackCopy.toString()}
    ${copyText.toString()}
    ${bindGuestInteractions.toString()}
    (function () {
      var photos = PHOTOS_PLACEHOLDER;
      var root = document.body;
      var THEME_KEY = "guest-guide-theme";
      var hostTheme = root.getAttribute("data-guest-theme") || "auto";
      if (hostTheme === "auto") {
        try {
          var saved = localStorage.getItem(THEME_KEY);
          if (saved === "light" || saved === "dark") root.dataset.guestTheme = saved;
        } catch (e) {}
      }
      function resolved() {
        var mode = root.dataset.guestTheme;
        if (mode === "dark" || mode === "light") return mode;
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      }
      bindGuestInteractions(root, photos, {
        onThemeToggle: function () {
          var next = resolved() === "dark" ? "light" : "dark";
          root.dataset.guestTheme = next;
          if (hostTheme === "auto") {
            try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
          }
        }
      });
    })();
  `;
}

function systemGuestTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function hydrateGuest(root, guidebook, previewTheme, options = {}) {
  if (!root) return;
  const preserveScroll = options.preserveScroll !== false;
  const scrollTop = preserveScroll ? root.scrollTop : 0;
  const keepPhoto = Number(root.dataset.previewPhoto || 0);
  const keepTheme = root.dataset.guestThemePreview;
  root.innerHTML = renderGuestInner(guidebook);
  const theme = guidebook.theme || "auto";
  if (keepTheme === "light" || keepTheme === "dark") {
    root.dataset.guestTheme = keepTheme;
  } else if (theme === "auto") {
    root.dataset.guestTheme = previewTheme === "light" || previewTheme === "dark" ? previewTheme : systemGuestTheme();
  } else {
    root.dataset.guestTheme = theme;
  }
  const photos = (guidebook.photos || [])
    .map((photo) => safeUrl(photo.url, { allowDataImage: true }))
    .filter(Boolean);
  bindGuestInteractions(root, photos, {
    startIndex: keepPhoto,
    onThemeToggle: () => {
      root.dataset.guestTheme = root.dataset.guestTheme === "dark" ? "light" : "dark";
      root.dataset.guestThemePreview = root.dataset.guestTheme;
    },
  });
  root.scrollTop = scrollTop;
}

globalThis.escapeHtml = escapeHtml;
globalThis.safeUrl = safeUrl;
globalThis.attrUrl = attrUrl;
globalThis.jsonForScript = jsonForScript;
globalThis.fullAddress = fullAddress;
globalThis.mapsUrl = mapsUrl;
globalThis.osmEmbed = osmEmbed;
globalThis.validCoords = validCoords;
globalThis.renderGuestInner = renderGuestInner;
globalThis.guestPageScript = guestPageScript;
globalThis.hydrateGuest = hydrateGuest;
