// Gates the builder behind HTTP Basic Auth. The landing page, the exported
// sample guides and the preview gallery stay public; only the pages and assets
// that let someone adjust a guidebook are matched below.
export const config = {
  matcher: ["/studio", "/studio.html", "/js/studio.js", "/js/export.js", "/css/studio.css"],
};

const REALM = 'Basic realm="Digital Guidebook builder", charset="UTF-8"';

function constantTimeEqual(a, b) {
  const encoder = new TextEncoder();
  const left = encoder.encode(a);
  const right = encoder.encode(b);
  if (left.length !== right.length) return false;
  let diff = 0;
  for (let i = 0; i < left.length; i += 1) diff |= left[i] ^ right[i];
  return diff === 0;
}

function parseBasicAuth(header) {
  if (!header || !/^Basic /i.test(header)) return null;
  let decoded;
  try {
    decoded = atob(header.slice(6).trim());
  } catch {
    return null;
  }
  const separator = decoded.indexOf(":");
  if (separator === -1) return null;
  return { user: decoded.slice(0, separator), password: decoded.slice(separator + 1) };
}

function page(title, message, status, headers = {}) {
  const body = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex" />
<title>${title}</title>
<style>
  :root { color-scheme: light dark; }
  body {
    margin: 0;
    min-height: 100vh;
    display: grid;
    place-items: center;
    padding: 24px;
    background: #f4f2ef;
    color: #191521;
    font-family: "Plus Jakarta Sans", "Segoe UI", system-ui, sans-serif;
  }
  .card {
    max-width: 30rem;
    padding: 34px 32px;
    background: #fff;
    border: 1px solid #ece7f0;
    border-radius: 24px;
    box-shadow: 0 18px 40px -28px rgba(50, 35, 90, 0.35);
    text-align: center;
  }
  .glyph {
    display: grid;
    place-items: center;
    width: 48px;
    height: 48px;
    margin: 0 auto 18px;
    border-radius: 16px;
    color: #fff;
    background: linear-gradient(140deg, #7b43e0, #5a2bb4);
  }
  h1 { margin: 0 0 8px; font-size: 22px; letter-spacing: -0.03em; }
  p { margin: 0 0 18px; color: #6d6878; line-height: 1.55; }
  a { color: #6d43d0; font-weight: 600; text-decoration: none; }
  a:hover { text-decoration: underline; }
  @media (prefers-color-scheme: dark) {
    body { background: #0e0c13; color: #f5f2fa; }
    .card { background: #171420; border-color: #2a2436; }
    p { color: #948ca6; }
    a { color: #bda3ff; }
  }
</style>
</head>
<body>
  <div class="card">
    <div class="glyph">
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8">
        <rect x="4.5" y="10.5" width="15" height="9.5" rx="2.5"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>
      </svg>
    </div>
    <h1>${title}</h1>
    <p>${message}</p>
    <p><a href="/">Back to the homepage</a> · <a href="https://guest-guides-preview.vercel.app">Browse the guide previews</a></p>
  </div>
</body>
</html>`;
  return new Response(body, {
    status,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
      "x-robots-tag": "noindex",
      ...headers,
    },
  });
}

export default function middleware(request) {
  const expected = process.env.STUDIO_PASSWORD;
  if (!expected) {
    return page(
      "Builder not configured",
      "This builder is password protected, but no password has been set for the deployment yet.",
      503
    );
  }

  const credentials = parseBasicAuth(request.headers.get("authorization"));
  const expectedUser = process.env.STUDIO_USER || "host";
  const authorised =
    credentials &&
    constantTimeEqual(credentials.user, expectedUser) &&
    constantTimeEqual(credentials.password, expected);

  if (!authorised) {
    return page(
      "This builder is private",
      "Sign in with the host username and password to edit guidebooks. The sample guides stay open to everyone.",
      401,
      { "www-authenticate": REALM }
    );
  }

  return undefined;
}
