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

const PIN_SELECTOR = "[data-grid-item]:first-child";

function centerPin() {
  const pin = document.querySelector(PIN_SELECTOR);
  if (pin) {
    pin.style.left = "50%";
    pin.style.transform = "translateX(-50%) translateY(0px)";
  }
}

function applyCustomPageClass() {
  // Remove any previously applied page class if any
  const pageType = getPageType();
  document.body.classList.remove(...Object.values(PAGE_CLASSES));
  // Add the current one
  document.body.classList.add(pageType);

  if (pageType === PAGE_CLASSES.pin) centerPin();
}

// Run on first load
applyCustomPageClass();

// Re-run when Pinterest navigates without reloading (SPA behavior)
document.addEventListener("click", applyCustomPageClass);
window.addEventListener("popstate", applyCustomPageClass);
