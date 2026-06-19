(function applyEarlyPageClass() {
  const path = location.pathname;
  if (location.hostname.includes("instagram.com")) {
    if (path === "/" || path === "") {
      document.documentElement.classList.add("ig-homefeed");
    } else if (path.startsWith("/reels")) {
      document.documentElement.classList.add("ig-reels");
    }
  } else if (
    location.hostname.includes("pinterest.com") &&
    (path === "/" || path === "/homefeed/")
  ) {
    document.documentElement.classList.add("pf-homefeed");
  }
})();

function getSite() {
  if (location.hostname.includes("pinterest.com")) return "pinterest";
  if (location.hostname.includes("instagram.com")) return "instagram";
  return null;
}

// Custom classes for each page type
const PINTEREST_PAGE_CLASSES = {
  homefeed: "pf-homefeed",
  search: "pf-search",
  pin: "pf-pin",
  other: "pf-other", // boards, profiles, etc.
};

const INSTAGRAM_PAGE_CLASSES = {
  homefeed: "ig-homefeed",
  reels: "ig-reels",
  other: "ig-other",
};

function getPinterestPageType() {
  const path = window.location.pathname;
  if (path === "/" || path === "/homefeed/") return PINTEREST_PAGE_CLASSES.homefeed;
  if (path.startsWith("/search/")) return PINTEREST_PAGE_CLASSES.search;
  if (path.startsWith("/pin/")) return PINTEREST_PAGE_CLASSES.pin;
  return PINTEREST_PAGE_CLASSES.other;
}

function getInstagramPageType() {
  const path = window.location.pathname;
  if (path === "/" || path === "") return INSTAGRAM_PAGE_CLASSES.homefeed;
  if (path.startsWith("/reels")) return INSTAGRAM_PAGE_CLASSES.reels;
  return INSTAGRAM_PAGE_CLASSES.other;
}

function isInstagramBlockedPage(pageType) {
  return (
    pageType === INSTAGRAM_PAGE_CLASSES.homefeed ||
    pageType === INSTAGRAM_PAGE_CLASSES.reels
  );
}

// Center the pin when viewing a single pin
const PIN_SELECTOR = "[data-grid-item]:first-child";
let originalPinStyles = null;
function centerPin() {
  const pin = document.querySelector(PIN_SELECTOR);
  if (!pin) return;

  // Save Pinterest's original styles before overwriting, so we can restore them later
  if (!originalPinStyles) {
    originalPinStyles = {
      left: pin.style.left,
      transform: pin.style.transform,
    };
  }

  pin.style.left = "50%";
  pin.style.transform = "translateX(-50%) translateY(0px)";
}
// Reset the pin position when navigating away from the single pin page
function resetPinPosition() {
  if (!originalPinStyles) return;
  const pin = document.querySelector(PIN_SELECTOR);
  if (pin) {
    pin.style.left = originalPinStyles.left;
    pin.style.transform = originalPinStyles.transform;
  }
  originalPinStyles = null;
}
 
function setRootPageClass(allClasses, pageType) {
  document.documentElement.classList.remove(...allClasses);
  document.documentElement.classList.add(pageType);
  if (document.body) {
    document.body.classList.remove(...allClasses);
    document.body.classList.add(pageType);
  }
}

function showHomefeedMessage(color = "#e60023") {
  if (!document.body || document.getElementById("pf-message")) return;

  const message = document.createElement("div");
  message.id = "pf-message";
  message.textContent = "You've consumed enough. It's time to create.";

  Object.assign(message.style, {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    fontFamily: "Georgia, serif",
    fontSize: "52px",
    maxWidth: "720px",
    fontWeight: "bold",
    color,
    textAlign: "center",
    lineHeight: "1.3",
    letterSpacing: "-0.01em",
    pointerEvents: "none",
    zIndex: "9999",
    textShadow: `-5px -5px 0 #f5f5dc, 5px -5px 0 #f5f5dc, -5px 5px 0 #f5f5dc, 5px 5px 0 #f5f5dc`,
  });

  document.body.appendChild(message);
}

function hideHomefeedMessage() {
  const message = document.getElementById("pf-message");
  if (message) {
    message.remove();
  }
}

// Observe the body for changes and center the pin when a single pin is loaded
let singlePinObserver = new MutationObserver(() => centerPin());

function applyPinterestChanges() {
  const pageType = getPinterestPageType();
  setRootPageClass(Object.values(PINTEREST_PAGE_CLASSES), pageType);

  if (pageType === PINTEREST_PAGE_CLASSES.pin && document.body) {
    singlePinObserver.disconnect();
    originalPinStyles = null;
    centerPin();
    singlePinObserver.observe(document.body, { childList: true });
  } else {
    singlePinObserver.disconnect();
    resetPinPosition();
  }

  if (pageType === PINTEREST_PAGE_CLASSES.homefeed) {
    showHomefeedMessage();
  } else {
    hideHomefeedMessage();
  }
}

function applyInstagramChanges() {
  const pageType = getInstagramPageType();
  setRootPageClass(Object.values(INSTAGRAM_PAGE_CLASSES), pageType);

  if (isInstagramBlockedPage(pageType)) {
    showHomefeedMessage("#E1306C");
  } else {
    hideHomefeedMessage();
  }
}

function applyChanges() {
  const site = getSite();
  if (site === "pinterest") applyPinterestChanges();
  else if (site === "instagram") applyInstagramChanges();
}

function showHomefeedMessageEarly() {
  const site = getSite();
  if (!site) return;

  const pageType =
    site === "instagram"
      ? getInstagramPageType()
      : getPinterestPageType();
  const isBlocked =
    site === "instagram"
      ? isInstagramBlockedPage(pageType)
      : pageType === PINTEREST_PAGE_CLASSES.homefeed;
  if (!isBlocked) return;

  const color = site === "instagram" ? "#E1306C" : "#e60023";
  if (document.body) {
    showHomefeedMessage(color);
    return;
  }

  new MutationObserver((_, observer) => {
    if (document.body) {
      showHomefeedMessage(color);
      observer.disconnect();
    }
  }).observe(document.documentElement, { childList: true });
}

showHomefeedMessageEarly();
applyChanges();

// Re-run when navigating without reloading (SPA behavior)
document.addEventListener("click", applyChanges);
window.addEventListener("popstate", applyChanges);

// Fallback: catch navigations that bypass click/popstate (e.g. search with keyboard)
let lastUrl = location.href;
setInterval(() => {
  if (location.href !== lastUrl) {
    lastUrl = location.href;
    applyChanges();
  }
}, 500);
