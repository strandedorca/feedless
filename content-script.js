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

function resetPin() {
  if (!originalPinStyles) return;

  const pin = document.querySelector(PIN_SELECTOR);
  if (pin) {
    console.log("originalPinStyles", originalPinStyles);
    pin.style.left = originalPinStyles.left;
    pin.style.transform = originalPinStyles.transform;
    console.log("pin.style.left", pin.style.left);
    console.log("pin.style.transform", pin.style.transform);
  }
  originalPinStyles = null;
}

function showHomefeedMessage() {
  if (document.getElementById("pf-message")) return;

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
    color: "#e60023",
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

let singlePinObserver = new MutationObserver(() => centerPin());

function applyCustomPageClass() {
  const pageType = getPageType();
  document.body.classList.remove(...Object.values(PAGE_CLASSES));
  document.body.classList.add(pageType);

  if (pageType === PAGE_CLASSES.pin) {
    if (singlePinObserver) {
      singlePinObserver.disconnect();
    }
    centerPin();
    singlePinObserver.observe(document.body, { childList: true });
  } else {
    if (singlePinObserver) {
      singlePinObserver.disconnect();
    }
    resetPin();
  }

  if (pageType === PAGE_CLASSES.homefeed) {
    showHomefeedMessage();
  } else {
    hideHomefeedMessage();
  }
}

// Run on first load
applyCustomPageClass();

// Re-run when Pinterest navigates without reloading (SPA behavior)
document.addEventListener("click", applyCustomPageClass);
window.addEventListener("popstate", applyCustomPageClass);
