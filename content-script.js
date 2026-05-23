const PAGE_CLASSES = {
  homefeed: "pf-homefeed",
  search: "pf-search",
  pin: "pf-pin",
  other: "pf-other", // boards, profiles, etc.
};

function getPageType() {
  const path = window.location.pathname;
  if (path === "/" || path === "/homefeed/") return PAGE_CLASSES.homefeed;
  if (path.startsWith("/search/")) return PAGE_CLASSES.search;
  if (path.startsWith("/pin/")) return PAGE_CLASSES.pin;
  return PAGE_CLASSES.other;
}

function applyCustomPageClass() {
  // Remove any previously applied page class if any
  document.body.classList.remove(...Object.values(PAGE_CLASSES));
  // Add the current one
  document.body.classList.add(getPageType());
}

// Run on first load
applyCustomPageClass();

// Re-run when Pinterest navigates without reloading (SPA behavior)
document.addEventListener("click", applyCustomPageClass);
window.addEventListener("popstate", applyCustomPageClass);
