(function () {
  const constants = window.appConstants || {};
  const imageFallbacks = constants.images || {};
  const categoryLabels = constants.cardCategoryLabels || {};

  function byId(id) {
    return document.getElementById(id);
  }

  function clearElement(element) {
    if (element) element.replaceChildren();
  }

  function createMessage(message) {
    const paragraph = document.createElement("p");
    paragraph.style.textAlign = "center";
    paragraph.style.color = "#888";
    paragraph.textContent = message;
    return paragraph;
  }

  function createBackendNotice(title, message) {
    const notice = document.createElement("div");
    notice.className = "backend-required surface-card";

    const heading = document.createElement("h3");
    heading.textContent = title;

    const text = document.createElement("p");
    text.textContent = message;

    notice.append(heading, text);
    return notice;
  }

  function getSafeUrl(value, allowedProtocols, fallback = "") {
    if (!value) return fallback;

    try {
      const url = new URL(value, window.location.href);
      if (allowedProtocols.includes(url.protocol)) {
        return url.href;
      }
    } catch (err) {
      console.warn("Invalid URL:", err);
    }

    return fallback;
  }

  function getSafeImageUrl(src, fallbackSrc = imageFallbacks.cardFallback || "") {
    return getSafeUrl(src, ["http:", "https:"], fallbackSrc);
  }

  function getSafeLinkUrl(href) {
    return getSafeUrl(href, ["http:", "https:", "mailto:", "tel:"], "");
  }

  function setImageWithFallback(img, src, alt, fallbackSrc = imageFallbacks.cardFallback || "") {
    if (!img) return;

    const finalFallback = fallbackSrc || imageFallbacks.cardFallback || "";
    img.alt = alt || "";
    if (!img.decoding) img.decoding = "async";
    img.src = getSafeImageUrl(src, finalFallback);
    img.addEventListener("error", () => {
      if (img.src !== finalFallback) {
        img.src = finalFallback;
      }
    }, { once: true });
  }

  function getCardCategoryLabel(category) {
    return categoryLabels[category] || category || "";
  }

  function hasCardCategoryLabel(category) {
    return Boolean(categoryLabels[category]);
  }

  const thaiDigits = new Map([
    ["๐", "0"],
    ["๑", "1"],
    ["๒", "2"],
    ["๓", "3"],
    ["๔", "4"],
    ["๕", "5"],
    ["๖", "6"],
    ["๗", "7"],
    ["๘", "8"],
    ["๙", "9"],
  ]);

  function normalizeSection(value) {
    return String(value || "")
      .replace(/[๐-๙]/g, (digit) => thaiDigits.get(digit) || digit)
      .trim();
  }

  function getSectionParts(value) {
    const matches = normalizeSection(value).match(/\d+/g);
    return matches ? matches.map((part) => Number(part)) : [];
  }

  function compareLawSections(a, b) {
    const aSection = normalizeSection(a && a.section);
    const bSection = normalizeSection(b && b.section);
    const aParts = getSectionParts(aSection);
    const bParts = getSectionParts(bSection);

    if (aParts.length !== bParts.length && (aParts.length === 0 || bParts.length === 0)) {
      return aParts.length === 0 ? 1 : -1;
    }

    const maxLength = Math.max(aParts.length, bParts.length);
    for (let index = 0; index < maxLength; index += 1) {
      const aPart = aParts[index] ?? -1;
      const bPart = bParts[index] ?? -1;

      if (aPart !== bPart) {
        return aPart - bPart;
      }
    }

    return aSection.localeCompare(bSection, "th", {
      numeric: true,
      sensitivity: "base",
    });
  }

  function sortLawsBySection(laws) {
    return Array.isArray(laws) ? [...laws].sort(compareLawSections) : [];
  }

  window.uiUtils = {
    byId,
    clearElement,
    createMessage,
    createBackendNotice,
    getSafeUrl,
    getSafeImageUrl,
    getSafeLinkUrl,
    setImageWithFallback,
    getCardCategoryLabel,
    hasCardCategoryLabel,
    compareLawSections,
    sortLawsBySection
  };
})();
