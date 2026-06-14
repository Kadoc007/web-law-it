// card-detail.js - แสดงรายละเอียดการ์ดผ่าน Backend API

const detailUi = window.uiUtils;
const fallbackHeroImage = window.appConstants.images.heroFallback;
const safeContentTags = new Set([
  "a",
  "b",
  "blockquote",
  "br",
  "code",
  "div",
  "em",
  "h1",
  "h2",
  "h3",
  "h4",
  "i",
  "img",
  "li",
  "ol",
  "p",
  "pre",
  "span",
  "strong",
  "table",
  "tbody",
  "td",
  "th",
  "thead",
  "tr",
  "ul"
]);
const blockedContentTags = new Set([
  "script",
  "style",
  "iframe",
  "object",
  "embed",
  "form",
  "input",
  "button",
  "textarea",
  "select",
  "template",
  "svg",
  "math"
]);
const safeClassNames = new Set(["org", "time", "address", "travel"]);

function getUrlParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    id: params.get("id"),
    slug: params.get("slug")
  };
}

function hasHtmlMarkup(text) {
  return /<\/?[a-z][\s\S]*>/i.test(text);
}

function renderPlainTextContent(container, content) {
  const text = (content || "").trim();

  if (!text) {
    const empty = document.createElement("p");
    empty.className = "card-empty-state";
    empty.textContent = "ไม่มีเนื้อหาเพิ่มเติม";
    container.appendChild(empty);
    return;
  }

  text
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .forEach((block) => {
      const paragraph = document.createElement("p");
      paragraph.textContent = block;
      container.appendChild(paragraph);
    });
}

function copySafeClassName(source, target) {
  const safeClasses = Array.from(source.classList || [])
    .filter((className) => safeClassNames.has(className));

  if (safeClasses.length > 0) {
    target.className = safeClasses.join(" ");
  }
}

function sanitizeContentNode(node) {
  if (node.nodeType === Node.TEXT_NODE) {
    return document.createTextNode(node.textContent || "");
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return document.createDocumentFragment();
  }

  const tagName = node.tagName.toLowerCase();
  const fragment = document.createDocumentFragment();

  if (blockedContentTags.has(tagName)) {
    return fragment;
  }

  if (!safeContentTags.has(tagName)) {
    node.childNodes.forEach((child) => {
      fragment.appendChild(sanitizeContentNode(child));
    });
    return fragment;
  }

  const element = document.createElement(tagName);
  copySafeClassName(node, element);

  if (tagName === "a") {
    const safeHref = detailUi.getSafeLinkUrl(node.getAttribute("href"));
    if (safeHref) {
      element.href = safeHref;
      element.target = "_blank";
      element.rel = "noopener noreferrer";
    }
  }

  if (tagName === "img") {
    const safeSrc = detailUi.getSafeImageUrl(node.getAttribute("src"), "");
    if (!safeSrc) {
      return fragment;
    }

    element.src = safeSrc;
    element.alt = node.getAttribute("alt") || "";
    element.loading = "lazy";
    element.decoding = "async";
  }

  node.childNodes.forEach((child) => {
    element.appendChild(sanitizeContentNode(child));
  });

  return element;
}

function renderSafeRichContent(container, content) {
  container.replaceChildren();

  const text = (content || "").trim();
  if (!hasHtmlMarkup(text)) {
    renderPlainTextContent(container, text);
    return;
  }

  const parsed = new DOMParser().parseFromString(text, "text/html");
  const fragment = document.createDocumentFragment();

  parsed.body.childNodes.forEach((node) => {
    fragment.appendChild(sanitizeContentNode(node));
  });

  if (!fragment.hasChildNodes()) {
    renderPlainTextContent(container, "");
    return;
  }

  container.appendChild(fragment);
}

async function loadCardDetail() {
  const { id, slug } = getUrlParams();

  if (!id && !slug) {
    showError("ไม่พบข้อมูลการ์ด");
    return;
  }

  try {
    const card = id
      ? await window.apiClient.cards.get(id)
      : await window.apiClient.cards.getBySlug(slug);

    displayCard(card);
  } catch (err) {
    console.error("Error loading card:", err);
    showError("ไม่พบข้อมูลการ์ด หรือเกิดข้อผิดพลาด");
  }
}

function displayCard(card) {
  document.title = `${card.title || "รายละเอียด"} - คลังข้อมูลกฎหมาย IT`;

  const heroImage = document.getElementById("card-image");
  if (heroImage) {
    heroImage.decoding = "async";
    heroImage.fetchPriority = "high";
    detailUi.setImageWithFallback(heroImage, card.imageUrl, card.title, fallbackHeroImage);
  }

  const titleEl = document.getElementById("card-title");
  if (titleEl) titleEl.textContent = card.title || "ไม่มีหัวข้อ";

  const subtitleEl = document.getElementById("card-subtitle");
  if (subtitleEl) {
    if (card.subtitle) {
      subtitleEl.textContent = card.subtitle;
      subtitleEl.style.display = "block";
    } else {
      subtitleEl.style.display = "none";
    }
  }

  const categoryBadge = document.getElementById("card-category-badge");
  if (categoryBadge) {
    if (card.category && detailUi.hasCardCategoryLabel(card.category)) {
      categoryBadge.textContent = detailUi.getCardCategoryLabel(card.category);
      categoryBadge.style.display = "inline-block";
    } else {
      categoryBadge.style.display = "none";
    }
  }

  const descEl = document.getElementById("card-description");
  if (descEl) {
    if (card.description) {
      descEl.textContent = card.description;
      descEl.style.display = "block";
    } else {
      descEl.style.display = "none";
    }
  }

  const contentEl = document.getElementById("card-content");
  if (contentEl) {
    renderSafeRichContent(contentEl, card.pageContent);
  }
}

function showError(message) {
  const hero = document.getElementById("card-hero");
  if (hero) hero.style.display = "none";

  const body = document.querySelector(".card-body");
  if (!body) return;

  const wrapper = document.createElement("div");
  wrapper.className = "error-message";

  const heading = document.createElement("h2");
  heading.textContent = "ไม่พบข้อมูล";

  const text = document.createElement("p");
  text.textContent = message;

  const link = document.createElement("a");
  link.href = "home.html";
  link.className = "btn btn-primary back-btn";
  link.textContent = "กลับหน้าแรก";

  wrapper.append(heading, text, link);
  body.replaceChildren(wrapper);
}

document.addEventListener("DOMContentLoaded", loadCardDetail);
