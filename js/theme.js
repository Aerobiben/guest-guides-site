const THEME_KEY = "digital-guidebook-theme";

try {
  const saved = localStorage.getItem(THEME_KEY);
  document.documentElement.dataset.theme = saved === "light" || saved === "dark"
    ? saved
    : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
} catch {
  /* ignore */
}

function systemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function storedTheme() {
  try {
    const value = localStorage.getItem(THEME_KEY);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null;
  }
}

function resolvedTheme() {
  return storedTheme() || systemTheme();
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  document.dispatchEvent(new CustomEvent("themechange", { detail: { theme } }));
}

function setTheme(theme) {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    /* ignore */
  }
  applyTheme(theme);
}

function initTheme(toggleSelector) {
  const next = resolvedTheme();
  if (document.documentElement.dataset.theme !== next) applyTheme(next);
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    if (!storedTheme()) applyTheme(systemTheme());
  });
  const toggle = toggleSelector ? document.querySelector(toggleSelector) : null;
  if (toggle) {
    toggle.addEventListener("click", () => {
      setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
    });
  }
}

globalThis.initTheme = initTheme;
globalThis.setTheme = setTheme;
globalThis.resolvedTheme = resolvedTheme;
