function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function mapsUrl(guidebook) {
  const { address } = guidebook;
  if (address.linkBehavior === "latlng" && address.lat && address.lng) {
    return `https://www.google.com/maps?q=${encodeURIComponent(`${address.lat},${address.lng}`)}`;
  }
  if (address.linkBehavior === "address" || address.linkBehavior === "automatic") {
    const query = fullAddress(guidebook);
    return `https://www.google.com/maps?q=${encodeURIComponent(query)}`;
  }
  return `https://www.google.com/maps?q=${encodeURIComponent(fullAddress(guidebook))}`;
}

function fullAddress(guidebook) {
  const a = guidebook.address;
  return [a.line1, a.streetNumber, a.streetName, a.city, a.state, a.postal, a.country]
    .filter(Boolean)
    .filter((part, index, arr) => arr.indexOf(part) === index)
    .join(", ");
}

function osmEmbed(guidebook) {
  const lat = Number(guidebook.address.lat) || 37.7793;
  const lng = Number(guidebook.address.lng) || -122.4794;
  const d = 0.01;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${lng - d}%2C${lat - d}%2C${lng + d}%2C${lat + d}&layer=mapnik&marker=${lat}%2C${lng}`;
}

function phoneHref(phone) {
  return `tel:${String(phone).replace(/[^\d+]/g, "")}`;
}

function renderGuestInner(guidebook) {
  const photos = (guidebook.photos || []).filter((photo) => photo.url);
  const hero = photos[0];
  const rest = photos.slice(1, 5);
  const recs = guidebook.recommendations || [];
  const manuals = guidebook.houseManual || [];
  const rules = guidebook.houseRules || [];
  const hasWifi = guidebook.wifi.network || guidebook.wifi.password;
  const hasAddress = fullAddress(guidebook);

  return `
    <div class="guest-shell">
      <section class="guest-hero" style="${hero ? `background-image:url('${escapeHtml(hero.url)}')` : ""}" data-hero>
        <div class="guest-hero-copy">
          <p>${escapeHtml(guidebook.hostName || "Your host")}</p>
          <h1>${escapeHtml(guidebook.propertyName || guidebook.title || "Guest guide")}</h1>
          <div class="guest-dots">${photos.map((_, i) => `<button type="button" data-photo="${i}" class="${i === 0 ? "is-on" : ""}"></button>`).join("")}</div>
        </div>
      </section>
      <div class="guest-body">
        <p class="guest-welcome">${escapeHtml(guidebook.intro.welcome || "Welcome. This guide has everything you need for the stay.")}</p>
        <p class="guest-about ${guidebook.intro.about ? "" : "guest-hidden"}">${escapeHtml(guidebook.intro.about)}</p>
        <div class="guest-gallery ${rest.length ? "" : "guest-hidden"}">
          ${rest.map((photo) => `<img src="${escapeHtml(photo.url)}" alt="${escapeHtml(photo.caption || guidebook.propertyName)}" />`).join("")}
        </div>
        <div class="guest-actions">
          <a href="${hasWifi ? "#wifi" : "#checkin"}"><strong>Wi‑Fi</strong><span>${escapeHtml(guidebook.wifi.network || "Details inside")}</span></a>
          <a href="#checkin"><strong>Check-in</strong><span>${escapeHtml(guidebook.checkIn.time || "See notes")}</span></a>
          <a href="${mapsUrl(guidebook)}" target="_blank" rel="noreferrer"><strong>Map</strong><span>${escapeHtml(guidebook.address.city || "Directions")}</span></a>
          <a href="${guidebook.hostPhone ? phoneHref(guidebook.hostPhone) : "#book"}"><strong>Host</strong><span>${escapeHtml(guidebook.hostPhone || guidebook.hostName || "Message us")}</span></a>
        </div>

        <article class="guest-card ${hasWifi ? "" : "guest-hidden"}" id="wifi">
          <h2>Wi‑Fi</h2>
          <div class="guest-wifi"><div>Network</div><div><strong>${escapeHtml(guidebook.wifi.network)}</strong> <button type="button" data-copy="${escapeHtml(guidebook.wifi.network)}">Copy</button></div></div>
          <div class="guest-wifi"><div>Password</div><div><strong>${escapeHtml(guidebook.wifi.password)}</strong> <button type="button" data-copy="${escapeHtml(guidebook.wifi.password)}">Copy</button></div></div>
          <p>${escapeHtml(guidebook.wifi.notes)}</p>
        </article>

        <article class="guest-card" id="checkin">
          <h2>Check-in</h2>
          <p>From <strong>${escapeHtml(guidebook.checkIn.time || "—")}</strong>${guidebook.checkIn.accessCode ? ` · Door code <strong>${escapeHtml(guidebook.checkIn.accessCode)}</strong>` : ""}</p>
          <p>${escapeHtml(guidebook.checkIn.instructions)}</p>
        </article>

        <article class="guest-card" id="directions">
          <h2>Directions</h2>
          <p>${escapeHtml(hasAddress)}</p>
          <p>${escapeHtml(guidebook.directions.notes)}</p>
          <iframe class="guest-map" title="Map" src="${osmEmbed(guidebook)}"></iframe>
        </article>

        <article class="guest-card" id="parking">
          <h2>Parking</h2>
          <p>${escapeHtml(guidebook.parking.notes || "Ask us if you are arriving by car.")}</p>
        </article>

        <article class="guest-card" id="house">
          <h2>House manual</h2>
          ${manuals.map((item) => `<p><strong>${escapeHtml(item.title)}</strong><br />${escapeHtml(item.body)}</p>`).join("") || "<p>Make yourself at home. Text us if anything is unclear.</p>"}
          ${rules.length ? `<ul>${rules.map((rule) => `<li>${escapeHtml(rule)}</li>`).join("")}</ul>` : ""}
        </article>

        <article class="guest-card ${recs.length ? "" : "guest-hidden"}" id="recs">
          <h2>Recommendations</h2>
          ${recs.map((rec) => `
            <a class="guest-rec" href="${escapeHtml(rec.url || mapsUrl(guidebook))}" target="_blank" rel="noreferrer">
              ${rec.image ? `<img src="${escapeHtml(rec.image)}" alt="${escapeHtml(rec.name)}" />` : "<div></div>"}
              <div>
                <small>${escapeHtml(rec.category || "Nearby")}</small>
                <p><strong>${escapeHtml(rec.name)}</strong></p>
                <p>${escapeHtml(rec.notes)}</p>
              </div>
            </a>
          `).join("")}
        </article>

        <article class="guest-card" id="checkout">
          <h2>Checkout</h2>
          <p>By <strong>${escapeHtml(guidebook.checkOut.time || "—")}</strong></p>
          <p>${escapeHtml(guidebook.checkOut.instructions)}</p>
        </article>

        <article class="guest-card" id="book">
          <h2>Book again</h2>
          <p>${escapeHtml(guidebook.bookAgain.message)}</p>
          ${guidebook.listingUrl ? `<p><a href="${escapeHtml(guidebook.listingUrl)}" target="_blank" rel="noreferrer">Open the listing</a></p>` : ""}
          <p>Emergency: ${escapeHtml(guidebook.emergency.localNumber || "local emergency services")}. ${escapeHtml(guidebook.emergency.notes)}</p>
        </article>
      </div>
      <nav class="guest-nav">
        <a href="#wifi">Wi‑Fi</a>
        <a href="#checkin">Check-in</a>
        <a href="#directions">Map</a>
        <a href="#parking">Parking</a>
        <a href="#house">House</a>
        <a href="#recs">Eats</a>
        <a href="#checkout">Out</a>
      </nav>
      <div class="guest-toast" data-toast>Copied</div>
    </div>
  `;
}

function guestPageScript() {
  return `
    (function () {
      var photos = PHOTOS_PLACEHOLDER;
      var hero = document.querySelector("[data-hero]");
      document.querySelectorAll("[data-photo]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          var i = Number(btn.getAttribute("data-photo"));
          if (!photos[i]) return;
          hero.style.backgroundImage = "url('" + photos[i] + "')";
          document.querySelectorAll("[data-photo]").forEach(function (el) { el.classList.toggle("is-on", el === btn); });
        });
      });
      var toast = document.querySelector("[data-toast]");
      document.querySelectorAll("[data-copy]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          var text = btn.getAttribute("data-copy") || "";
          if (navigator.clipboard) navigator.clipboard.writeText(text);
          toast.textContent = "Copied";
          toast.classList.add("is-on");
          setTimeout(function () { toast.classList.remove("is-on"); }, 1200);
        });
      });
    })();
  `;
}

globalThis.escapeHtml = escapeHtml;
globalThis.fullAddress = fullAddress;
globalThis.mapsUrl = mapsUrl;
globalThis.osmEmbed = osmEmbed;
globalThis.renderGuestInner = renderGuestInner;
globalThis.guestPageScript = guestPageScript;
globalThis.hydrateGuest = hydrateGuest;

function hydrateGuest(root, guidebook) {
  root.innerHTML = renderGuestInner(guidebook);
  const photos = (guidebook.photos || []).filter((photo) => photo.url).map((photo) => photo.url);
  const hero = root.querySelector("[data-hero]");
  root.querySelectorAll("[data-photo]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const i = Number(btn.getAttribute("data-photo"));
      if (!photos[i] || !hero) return;
      hero.style.backgroundImage = `url("${photos[i]}")`;
      root.querySelectorAll("[data-photo]").forEach((el) => el.classList.toggle("is-on", el === btn));
    });
  });
  const toast = root.querySelector("[data-toast]");
  root.querySelectorAll("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(btn.getAttribute("data-copy") || "");
      } catch {
        /* ignore */
      }
      if (toast) {
        toast.classList.add("is-on");
        setTimeout(() => toast.classList.remove("is-on"), 1200);
      }
    });
  });
}
