const fs = require("fs");
const path = require("path");
const { ROOT, loadGuidebookModules } = require("./guidebooks");

function readEnv() {
  return {
    api: (process.env.GUIDEBOOK_DATA_API || "https://api.github.com").replace(/\/$/, ""),
    dir: process.env.GUIDEBOOK_DATA_DIR || "",
    repo: process.env.GUIDEBOOK_DATA_REPO || "",
    ref: process.env.GUIDEBOOK_DATA_REF || "main",
    dataPath: process.env.GUIDEBOOK_DATA_PATH || "guidebooks",
    token: process.env.GUIDEBOOK_DATA_TOKEN || process.env.GITHUB_TOKEN || "",
  };
}

function normalize(raw, context, index) {
  const base = context.blankGuidebook();
  const guide = {
    ...base,
    ...raw,
    intro: { ...base.intro, ...(raw.intro || {}) },
    address: { ...base.address, ...(raw.address || {}) },
    wifi: { ...base.wifi, ...(raw.wifi || {}) },
    checkIn: { ...base.checkIn, ...(raw.checkIn || {}) },
    checkOut: { ...base.checkOut, ...(raw.checkOut || {}) },
    parking: { ...base.parking, ...(raw.parking || {}) },
    directions: { ...base.directions, ...(raw.directions || {}) },
    bookAgain: { ...base.bookAgain, ...(raw.bookAgain || {}) },
    emergency: { ...base.emergency, ...(raw.emergency || {}) },
    photos: (raw.photos || []).map((photo, i) => ({
      id: photo.id || `ph-${index}-${i}`,
      url: photo.url || "",
      caption: photo.caption || "",
    })),
    houseManual: (raw.houseManual || []).map((item, i) => ({
      id: item.id || `hm-${index}-${i}`,
      title: item.title || "",
      body: item.body || "",
    })),
    houseRules: raw.houseRules || [],
    recommendations: (raw.recommendations || []).map((item, i) => ({
      id: item.id || `rec-${index}-${i}`,
      name: item.name || "",
      category: item.category || "",
      notes: item.notes || "",
      url: item.url || "",
      image: item.image || "",
    })),
  };
  guide.id = raw.id || `gb-${index}`;
  guide.slug = context.slugify(raw.slug || guide.propertyName || guide.title);
  return guide;
}

function readLocalDir(dir) {
  const abs = path.isAbsolute(dir) ? dir : path.join(ROOT, dir);
  if (!fs.existsSync(abs)) throw new Error(`GUIDEBOOK_DATA_DIR not found: ${abs}`);
  return fs
    .readdirSync(abs)
    .filter((name) => name.endsWith(".json"))
    .sort()
    .map((name) => JSON.parse(fs.readFileSync(path.join(abs, name), "utf8")));
}

async function ghRequest(url, token, accept) {
  const headers = {
    Accept: accept,
    "User-Agent": "digital-guidebook-preview-build",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(url, { headers });
  if (!res.ok) {
    throw new Error(`GitHub ${res.status} ${res.statusText} for ${url.replace(/\?.*/, "")}`);
  }
  return res;
}

async function readPrivateRepo({ api, repo, ref, dataPath, token }) {
  const listUrl = `${api}/repos/${repo}/contents/${encodeURI(dataPath)}?ref=${encodeURIComponent(ref)}`;
  const listing = await (await ghRequest(listUrl, token, "application/vnd.github+json")).json();
  if (!Array.isArray(listing)) throw new Error(`${dataPath} is not a directory in ${repo}`);

  const files = listing
    .filter((entry) => entry.type === "file" && entry.name.endsWith(".json"))
    .sort((a, b) => a.name.localeCompare(b.name));
  if (!files.length) throw new Error(`no .json guidebooks under ${repo}/${dataPath}@${ref}`);

  const guides = [];
  for (const file of files) {
    const url = `${api}/repos/${repo}/contents/${encodeURI(file.path)}?ref=${encodeURIComponent(ref)}`;
    const text = await (await ghRequest(url, token, "application/vnd.github.raw")).text();
    guides.push(JSON.parse(text));
  }
  return guides;
}

// Resolution order: an explicit local directory, then the private data repo,
// then the bundled samples so a missing token never breaks the deployment.
async function resolveGuidebooks({ quiet = false } = {}) {
  const env = readEnv();
  const context = loadGuidebookModules();
  const note = (msg) => {
    if (!quiet) console.log(msg);
  };

  if (env.dir) {
    const raw = readLocalDir(env.dir);
    note(`guidebook data: local directory ${env.dir} (${raw.length} files)`);
    return { source: `dir:${env.dir}`, guides: raw.map((g, i) => normalize(g, context, i)), context };
  }

  if (env.repo) {
    try {
      const raw = await readPrivateRepo(env);
      note(`guidebook data: ${env.repo}/${env.dataPath}@${env.ref} (${raw.length} files)${env.token ? "" : " — unauthenticated"}`);
      return { source: `repo:${env.repo}`, guides: raw.map((g, i) => normalize(g, context, i)), context };
    } catch (error) {
      console.warn(`guidebook data: falling back to bundled samples — ${error.message}`);
    }
  }

  note("guidebook data: bundled sample templates");
  return {
    source: "bundled",
    guides: context.STARTER_TEMPLATES.map((g, i) => normalize(g, context, i)),
    context,
  };
}

module.exports = { resolveGuidebooks, normalize, readEnv };
