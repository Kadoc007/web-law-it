// viewer.js - ดูกฎหมายตามหมวดผ่าน Backend API และ category config

const params = new URLSearchParams(window.location.search);
const category = params.get("category");
const viewerUi = window.uiUtils;

if (!category) {
  window.location.replace("home.html");
}

const fallbackLawCategories = [
  {
    id: "computer",
    label: "กฎหมายคอมพิวเตอร์",
    viewerLabel: "กฎหมายคอมพิวเตอร์",
    fields: ["section", "title", "description", "penalty"],
    requiredFields: ["section", "title", "description"],
    hiddenFields: [],
  },
  {
    id: "privacy",
    label: "กฎหมายคุ้มครองข้อมูลส่วนบุคคล",
    viewerLabel: "กฎหมายคุ้มครองข้อมูลส่วนบุคคล (PDPA)",
    fields: ["section", "title", "description", "penalty"],
    requiredFields: ["section", "title", "description"],
    hiddenFields: [],
  },
  {
    id: "copyright",
    label: "กฎหมายเกี่ยวกับการพัฒนาโครงสร้างพื้นฐานสารสนเทศให้ทั่วถึง และเท่าเทียมกัน",
    viewerLabel: "กฎหมายเกี่ยวกับการพัฒนาโครงสร้างพื้นฐานสารสนเทศให้ทั่วถึง และเท่าเทียมกัน",
    fields: ["section", "title", "description", "penalty"],
    requiredFields: ["section", "title", "description"],
    hiddenFields: [],
  },
  {
    id: "eft",
    label: "กฎหมายเกี่ยวกับการโอนเงินทางอิเล็กทรอนิกส์",
    viewerLabel: "กฎหมายเกี่ยวกับการโอนเงินทางอิเล็กทรอนิกส์",
    fields: ["section", "title", "description", "penalty"],
    requiredFields: ["section", "title", "description"],
    hiddenFields: [],
  },
  {
    id: "etl",
    label: "กฎหมายเกี่ยวกับลายมือชื่ออิเล็กทรอนิกส์",
    viewerLabel: "กฎหมายเกี่ยวกับลายมือชื่ออิเล็กทรอนิกส์",
    fields: ["section", "title", "description", "penalty"],
    requiredFields: ["section", "title", "description"],
    hiddenFields: [],
  },
  {
    id: "eta",
    label: "กฎหมายเกี่ยวกับธุรกรรมทางอิเล็กทรอนิกส์",
    viewerLabel: "กฎหมายเกี่ยวกับธุรกรรมทางอิเล็กทรอนิกส์",
    fields: ["section", "title", "description", "penalty"],
    requiredFields: ["section", "title", "description"],
    hiddenFields: [],
  },
];

let lawCategories = [...fallbackLawCategories];

function mergeLawCategoryConfig(categories) {
  if (!Array.isArray(categories) || categories.length === 0) {
    return [...fallbackLawCategories];
  }

  const apiById = new Map(categories.map((item) => [item.id, item]));
  const fallbackIds = new Set(fallbackLawCategories.map((item) => item.id));
  const mergedKnownCategories = fallbackLawCategories.map((fallbackCategory) => {
    const apiCategory = apiById.get(fallbackCategory.id) || {};

    return {
      ...fallbackCategory,
      ...apiCategory,
      label: fallbackCategory.label,
      viewerLabel: fallbackCategory.viewerLabel,
    };
  });

  const extraApiCategories = categories.filter((item) => !fallbackIds.has(item.id));
  return [...mergedKnownCategories, ...extraApiCategories];
}

const lawFieldLabels = {
  section: "มาตรา",
  title: "หัวข้อ",
  description: "รายละเอียด",
  penalty: "โทษ",
};

function getCategoryConfig(categoryId) {
  return lawCategories.find((item) => item.id === categoryId) || fallbackLawCategories[0];
}

function getVisibleFields(config) {
  const hiddenFields = new Set(config.hiddenFields || []);
  return (config.fields || []).filter((field) => !hiddenFields.has(field));
}

function hasText(value) {
  return typeof value === "string" && value.trim() !== "";
}

function getFieldLabel(field) {
  return lawFieldLabels[field] || field;
}

function setLawTitle(config) {
  const title = document.getElementById("law-title");
  if (!title) return;

  const label = config.viewerLabel || config.label || "กฎหมาย";
  title.textContent = label;
  document.title = `${label} - IT LAW CENTER`;
}

async function loadLawCategoryConfig() {
  if (!window.apiClient || !window.apiClient.laws.categories) {
    return getCategoryConfig(category);
  }

  try {
    const categories = await window.apiClient.laws.categories();
    if (Array.isArray(categories) && categories.length > 0) {
      lawCategories = mergeLawCategoryConfig(categories);
    }
  } catch (err) {
    console.warn("Using fallback law category config:", err);
    lawCategories = mergeLawCategoryConfig([]);
  }

  return getCategoryConfig(category);
}

function showLawMessage(container, message) {
  const notice = document.createElement("div");
  notice.className = "law-message surface-card";

  const paragraph = document.createElement("p");
  paragraph.textContent = message;

  notice.append(paragraph);
  container.replaceChildren(notice);
}

function renderLawHeading(law, visibleFields) {
  const heading = document.createElement("h3");
  const parts = [];

  if (visibleFields.includes("section") && hasText(law.section)) {
    parts.push(law.section.trim());
  }

  if (visibleFields.includes("title") && hasText(law.title)) {
    parts.push(law.title.trim());
  }

  heading.textContent = parts.length > 0 ? parts.join(" : ") : "กฎหมาย";
  return heading;
}

function renderDescription(law, visibleFields) {
  if (!visibleFields.includes("description") || !hasText(law.description)) {
    return null;
  }

  const description = document.createElement("p");
  description.textContent = law.description.trim();
  return description;
}

function renderPenalty(law, visibleFields) {
  if (!visibleFields.includes("penalty") || !hasText(law.penalty)) {
    return null;
  }

  const penalty = document.createElement("div");
  penalty.className = "penalty";
  penalty.textContent = `${getFieldLabel("penalty")}: ${law.penalty.trim()}`;
  return penalty;
}

function renderExtraField(field, law) {
  if (["section", "title", "description", "penalty"].includes(field) || !hasText(law[field])) {
    return null;
  }

  const row = document.createElement("div");
  row.className = "law-field-row";

  const label = document.createElement("span");
  label.className = "law-field-label";
  label.textContent = getFieldLabel(field);

  const value = document.createElement("p");
  value.className = "law-field-value";
  value.textContent = law[field].trim();

  row.append(label, value);
  return row;
}

function renderLawCard(law, config) {
  const visibleFields = getVisibleFields(config);
  const div = document.createElement("article");
  div.className = "law-card surface-card";

  div.appendChild(renderLawHeading(law, visibleFields));

  const description = renderDescription(law, visibleFields);
  if (description) {
    div.appendChild(description);
  }

  visibleFields.forEach((field) => {
    const extraField = renderExtraField(field, law);
    if (extraField) {
      div.appendChild(extraField);
    }
  });

  const penalty = renderPenalty(law, visibleFields);
  if (penalty) {
    div.appendChild(penalty);
  }

  return div;
}

async function loadLaws() {
  const container = document.getElementById("law-list");

  try {
    const config = await loadLawCategoryConfig();
    setLawTitle(config);

    const laws = viewerUi.sortLawsBySection(await window.apiClient.laws.list(category));
    container.replaceChildren();

    laws.forEach((law) => {
      container.appendChild(renderLawCard(law, config));
    });

    if (laws.length === 0) {
      showLawMessage(container, "ยังไม่มีข้อมูล laws จาก Backend ในหมวดนี้");
    }
  } catch (err) {
    console.error("Error loading laws:", err);
    showLawMessage(
      container,
      "ยังไม่สามารถเชื่อมต่อ Backend ได้ กรุณารัน backend ก่อน จึงจะดึง laws มาแสดงได้"
    );
  }
}

if (category) {
  setLawTitle(getCategoryConfig(category));
  loadLaws();
}
