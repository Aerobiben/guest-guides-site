function buildGuestDocument(guidebook, guestCss) {
  const title = guidebook.propertyName || guidebook.title || "Guest guide";
  const photos = (guidebook.photos || []).filter((photo) => photo.url).map((photo) => photo.url);
  const script = guestPageScript().replace("PHOTOS_PLACEHOLDER", JSON.stringify(photos));
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)} — guest guide</title>
  <meta name="description" content="Wi‑Fi, check-in, house notes, and local picks for your stay." />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700&display=swap" rel="stylesheet" />
  <style>${guestCss}
    html, body { margin: 0; }
    body { background: #f4efe8; }
  </style>
</head>
<body class="guest-app">
${renderGuestInner(guidebook)}
<script>${script}</script>
</body>
</html>`;
}

function downloadTextFile(filename, contents) {
  const blob = new Blob([contents], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function slugify(value) {
  return String(value || "guest-guide")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "guest-guide";
}

globalThis.buildGuestDocument = buildGuestDocument;
globalThis.downloadTextFile = downloadTextFile;
globalThis.slugify = slugify;
