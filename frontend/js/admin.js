// admin.js - Admin Panel ผ่าน Backend API

let token = "";
let editId = null;
let editCardId = null;

const ui = window.uiUtils;
const byId = ui.byId;
const clearElement = ui.clearElement;
const createMessage = ui.createMessage;
const adminImageFallback = window.appConstants.images.adminThumbnailFallback;
const fallbackLawCategories = [
  {
    id: "computer",
    label: "กฎหมายคอมพิวเตอร์",
    fields: ["section", "title", "description", "penalty"],
    requiredFields: ["section", "title", "description"],
    hiddenFields: [],
  },
  {
    id: "privacy",
    label: "กฎหมายคุ้มครองข้อมูลส่วนบุคคล",
    fields: ["section", "title", "description", "penalty"],
    requiredFields: ["section", "title", "description"],
    hiddenFields: [],
  },
  {
    id: "copyright",
    label: "กฎหมายเกี่ยวกับการพัฒนาโครงสร้างพื้นฐานสารสนเทศให้ทั่วถึง และเท่าเทียมกัน",
    fields: ["section", "title", "description", "penalty"],
    requiredFields: ["section", "title", "description"],
    hiddenFields: [],
  },
  {
    id: "eft",
    label: "กฎหมายเกี่ยวกับการโอนเงินทางอิเล็กทรอนิกส์",
    fields: ["section", "title", "description", "penalty"],
    requiredFields: ["section", "title", "description"],
    hiddenFields: [],
  },
  {
    id: "etl",
    label: "กฎหมายเกี่ยวกับลายมือชื่ออิเล็กทรอนิกส์",
    fields: ["section", "title", "description", "penalty"],
    requiredFields: ["section", "title", "description"],
    hiddenFields: [],
  },
  {
    id: "eta",
    label: "กฎหมายเกี่ยวกับธุรกรรมทางอิเล็กทรอนิกส์",
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
    };
  });

  const extraApiCategories = categories.filter((item) => !fallbackIds.has(item.id));
  return [...mergedKnownCategories, ...extraApiCategories];
}

const lawFieldSpecs = {
  section: {
    label: "\u0e21\u0e32\u0e15\u0e23\u0e32",
    placeholder: "\u0e40\u0e0a\u0e48\u0e19 \u0e21\u0e32\u0e15\u0e23\u0e32 1",
    control: "input",
  },
  title: {
    label: "\u0e2b\u0e31\u0e27\u0e02\u0e49\u0e2d",
    placeholder: "\u0e2b\u0e31\u0e27\u0e02\u0e49\u0e2d\u0e01\u0e0e\u0e2b\u0e21\u0e32\u0e22",
    control: "input",
  },
  description: {
    label: "\u0e23\u0e32\u0e22\u0e25\u0e30\u0e40\u0e2d\u0e35\u0e22\u0e14",
    placeholder: "\u0e23\u0e32\u0e22\u0e25\u0e30\u0e40\u0e2d\u0e35\u0e22\u0e14\u0e40\u0e19\u0e37\u0e49\u0e2d\u0e2b\u0e32\u0e01\u0e0e\u0e2b\u0e21\u0e32\u0e22",
    control: "textarea",
    rows: 4,
  },
  penalty: {
    label: "\u0e42\u0e17\u0e29",
    placeholder: "\u0e42\u0e17\u0e29\u0e2b\u0e23\u0e37\u0e2d\u0e1a\u0e17\u0e25\u0e07\u0e42\u0e17\u0e29 (\u0e44\u0e21\u0e48\u0e1a\u0e31\u0e07\u0e04\u0e31\u0e1a)",
    control: "input",
  },
};

function getLawCategoryConfig(category) {
  return lawCategories.find((item) => item.id === category) || fallbackLawCategories[0];
}

function isLawFieldRequired(category, field) {
  return getLawCategoryConfig(category).requiredFields.includes(field);
}

function getVisibleLawFields(category) {
  const config = getLawCategoryConfig(category);
  return config.fields.filter((field) => !config.hiddenFields.includes(field) && lawFieldSpecs[field]);
}

function getCurrentLawFormValues() {
  const values = {};

  Object.keys(lawFieldSpecs).forEach((field) => {
    values[field] = byId(field)?.value || "";
  });

  return values;
}

function renderLawField(field, category, value) {
  const spec = lawFieldSpecs[field];
  const isRequired = isLawFieldRequired(category, field);
  const group = document.createElement("div");
  group.className = "form-group law-field";
  group.dataset.lawField = field;

  const label = document.createElement("label");
  label.htmlFor = field;
  label.textContent = spec.label;

  if (isRequired) {
    const requiredMark = document.createElement("span");
    requiredMark.className = "required";
    requiredMark.textContent = " *";
    label.append(requiredMark);
  } else {
    const optionalText = document.createElement("span");
    optionalText.className = "field-hint";
    optionalText.textContent = " (\u0e44\u0e21\u0e48\u0e1a\u0e31\u0e07\u0e04\u0e31\u0e1a)";
    label.append(optionalText);
  }

  const control = document.createElement(spec.control === "textarea" ? "textarea" : "input");
  control.id = field;
  control.className = "form-control";
  control.placeholder = spec.placeholder;
  control.value = value || "";

  if (spec.rows) {
    control.rows = spec.rows;
  }

  group.append(label, control);
  return group;
}

function renderLawFields(values = getCurrentLawFormValues()) {
  const fieldsContainer = byId("law-fields");
  const categorySelect = byId("category");
  if (!fieldsContainer || !categorySelect) return;

  const category = categorySelect.value || fallbackLawCategories[0].id;
  clearElement(fieldsContainer);

  getVisibleLawFields(category).forEach((field) => {
    fieldsContainer.appendChild(renderLawField(field, category, values[field]));
  });
}

function buildLawFormData(category) {
  const data = {};
  const missingLabels = [];

  getVisibleLawFields(category).forEach((field) => {
    const input = byId(field);
    const value = input ? input.value.trim() : "";
    data[field] = value;

    if (isLawFieldRequired(category, field) && !value) {
      missingLabels.push(lawFieldSpecs[field].label);
    }
  });

  return { data, missingLabels };
}

function setLawFormValues(law) {
  getVisibleLawFields(byId("category").value).forEach((field) => {
    const input = byId(field);
    if (input) {
      input.value = law[field] || "";
    }
  });
}

function renderLawCategoryOptions(categories = lawCategories) {
  const categorySelect = byId("category");
  if (!categorySelect) return;

  const currentValue = categorySelect.value;
  categorySelect.replaceChildren();

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.label;
    categorySelect.append(option);
  });

  if (categories.some((category) => category.id === currentValue)) {
    categorySelect.value = currentValue;
  }

  renderLawFields();
}

async function loadLawCategoryConfig() {
  if (!window.apiClient || !window.apiClient.laws.categories) {
    renderLawCategoryOptions();
    return;
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

  renderLawCategoryOptions();
}

async function getAdminToken() {
  const user = auth.currentUser;
  if (!user) {
    token = "";
    return "";
  }

  token = await user.getIdToken();
  return token;
}

async function login() {
  const email = byId("email").value;
  const password = byId("password").value;

  try {
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    token = await userCredential.user.getIdToken();

    byId("login-box").style.display = "none";
    byId("admin-panel").style.display = "block";

    await loadLawCategoryConfig();
    togglePenalty();
    loadAdminLaws();
    loadAdminCards();
  } catch (err) {
    console.error("Login error:", err);
    alert(`Login ไม่สำเร็จ: ${err.message}`);
  }
}

function logout() {
  if (!confirm("ต้องการออกจากระบบหรือไม่?")) return;

  auth.signOut();
  token = "";
  editId = null;
  editCardId = null;

  byId("admin-panel").style.display = "none";
  byId("login-box").style.display = "grid";
  clearElement(byId("admin-laws"));
  clearElement(byId("admin-cards"));

  resetForm();
  resetCardForm();
}

function showTab(tabName) {
  const buttons = document.querySelectorAll(".tab-btn");
  buttons.forEach((btn) => {
    const isActive = btn.dataset.adminTab === tabName;
    btn.classList.toggle("active", isActive);
    btn.setAttribute("aria-selected", String(isActive));
  });

  document.querySelectorAll(".tab-content").forEach((content) => {
    const isActive = content.id === `tab-${tabName}`;
    content.classList.toggle("active", isActive);
    content.hidden = !isActive;
  });

  if (tabName === "laws") {
    loadAdminLaws();
  } else if (tabName === "cards") {
    loadAdminCards();
  }
}

function togglePenalty() {
  renderLawFields();
}

function renderLawItem(law) {
  const item = document.createElement("div");
  item.className = "law-item surface-card interactive-lift d-flex align-items-center justify-content-between gap-3";

  const text = document.createElement("div");
  text.className = "law-text";

  const section = document.createElement("b");
  section.textContent = law.section || "";
  text.append(section, document.createTextNode(` - ${law.title || ""}`));

  const actions = document.createElement("div");
  actions.className = "action-buttons d-flex gap-2";

  const editButton = document.createElement("button");
  editButton.className = "btn btn-outline-primary btn-sm edit-btn";
  editButton.type = "button";
  editButton.textContent = "แก้ไข";
  editButton.addEventListener("click", () => editLaw(law));

  const deleteButton = document.createElement("button");
  deleteButton.className = "btn btn-danger btn-sm danger";
  deleteButton.type = "button";
  deleteButton.textContent = "ลบ";
  deleteButton.addEventListener("click", () => deleteLaw(law.id));

  actions.append(editButton, deleteButton);
  item.append(text, actions);
  return item;
}

async function loadAdminLaws() {
  const category = byId("category").value;
  const container = byId("admin-laws");

  togglePenalty();

  try {
    const laws = ui.sortLawsBySection(await window.apiClient.laws.list(category));
    clearElement(container);

    if (laws.length === 0) {
      container.appendChild(createMessage("ยังไม่มีข้อมูลกฎหมาย"));
      return;
    }

    laws.forEach((law) => {
      container.appendChild(renderLawItem(law));
    });
  } catch (err) {
    console.error("Error loading laws:", err);
    clearElement(container);
    container.appendChild(createMessage("โหลดข้อมูลกฎหมายไม่สำเร็จ กรุณาตรวจสอบ backend"));
  }
}

async function saveLaw() {
  if (!token) {
    alert("กรุณา Login ก่อน");
    return;
  }

  const category = byId("category").value;
  const { data, missingLabels } = buildLawFormData(category);

  if (missingLabels.length > 0) {
    alert(`\u0e01\u0e23\u0e38\u0e13\u0e32\u0e01\u0e23\u0e2d\u0e01 ${missingLabels.join(", ")}`);
    return;
  }

  try {
    const adminToken = await getAdminToken();

    if (editId) {
      await window.apiClient.laws.update(category, editId, data, adminToken);
      alert("แก้ไขข้อมูลสำเร็จ");
    } else {
      await window.apiClient.laws.create(category, data, adminToken);
      alert("เพิ่มข้อมูลสำเร็จ");
    }

    resetForm();
    loadAdminLaws();
  } catch (err) {
    console.error("Error saving law:", err);
    alert(`เกิดข้อผิดพลาด: ${err.message}`);
  }
}

function editLaw(law) {
  editId = law.id;
  renderLawFields();
  setLawFormValues(law);
  byId("saveBtn").textContent = "บันทึกการแก้ไข";
  byId("cancelLawBtn").style.display = "inline-block";
}

async function deleteLaw(id) {
  if (!token) return;
  if (!confirm("ยืนยันการลบ?")) return;

  const category = byId("category").value;

  try {
    const adminToken = await getAdminToken();
    await window.apiClient.laws.delete(category, id, adminToken);
    alert("ลบข้อมูลสำเร็จ");
    loadAdminLaws();
  } catch (err) {
    console.error("Error deleting law:", err);
    alert(`เกิดข้อผิดพลาด: ${err.message}`);
  }
}

function resetForm() {
  editId = null;
  renderLawFields({
    section: "",
    title: "",
    description: "",
    penalty: "",
  });
  byId("saveBtn").textContent = "เพิ่มข้อมูล";
  byId("cancelLawBtn").style.display = "none";
}

function renderCardItem(card) {
  const item = document.createElement("div");
  item.className = "card-item surface-card interactive-lift d-flex align-items-center gap-3";

  const img = document.createElement("img");
  img.className = "card-item-image";
  ui.setImageWithFallback(img, card.imageUrl, card.title, adminImageFallback);

  const info = document.createElement("div");
  info.className = "card-item-info";

  const title = document.createElement("div");
  title.className = "card-item-title";
  title.textContent = card.title || "ไม่มีหัวข้อ";

  const subtitle = document.createElement("div");
  subtitle.className = "card-item-subtitle";
  subtitle.textContent = card.subtitle || card.description || "-";

  info.append(title, subtitle);

  if (card.category) {
    const badge = document.createElement("span");
    badge.className = "badge rounded-pill card-item-category";
    badge.textContent = ui.getCardCategoryLabel(card.category);
    info.appendChild(badge);
  }

  const actions = document.createElement("div");
  actions.className = "action-buttons d-flex gap-2";

  const editButton = document.createElement("button");
  editButton.className = "btn btn-outline-primary btn-sm edit-btn";
  editButton.type = "button";
  editButton.textContent = "แก้ไข";
  editButton.addEventListener("click", () => editCard(card.id));

  const deleteButton = document.createElement("button");
  deleteButton.className = "btn btn-danger btn-sm danger";
  deleteButton.type = "button";
  deleteButton.textContent = "ลบ";
  deleteButton.addEventListener("click", () => deleteCard(card.id));

  actions.append(editButton, deleteButton);
  item.append(img, info, actions);
  return item;
}

function escapeArticleText(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildArticleTemplate() {
  const title = byId("card-title")?.value.trim() || "หัวข้อหลัก";
  const subtitle = byId("card-subtitle")?.value.trim() || "ประเด็นสำคัญ";
  const description = byId("card-description")?.value.trim() || "เขียนสรุปใจความสำคัญของเนื้อหา";

  return [
    `<h2>${escapeArticleText(title)}</h2>`,
    `<p><strong>สรุป:</strong> ${escapeArticleText(description)}</p>`,
    `<h3>${escapeArticleText(subtitle)}</h3>`,
    "<p>เขียนรายละเอียดหลักของบทความให้เป็นย่อหน้าสั้น อ่านง่าย และแยกหนึ่งประเด็นต่อหนึ่งย่อหน้า</p>",
    "<ul>",
    "  <li><strong>ประเด็นสำคัญ:</strong> อธิบายสิ่งที่ผู้อ่านควรรู้</li>",
    "  <li><strong>ข้อควรระวัง:</strong> ระบุเงื่อนไขหรือข้อยกเว้นที่สำคัญ</li>",
    "</ul>",
  ].join("\n\n");
}

function insertCardContentSnippet(snippet) {
  const input = byId("card-pageContent");
  if (!input) return;

  const start = input.selectionStart ?? input.value.length;
  const end = input.selectionEnd ?? input.value.length;
  const before = input.value.slice(0, start);
  const after = input.value.slice(end);
  const prefix = before && !before.endsWith("\n") ? "\n\n" : "";
  const suffix = after && !after.startsWith("\n") ? "\n\n" : "";

  input.value = `${before}${prefix}${snippet}${suffix}${after}`;

  const cursorPosition = before.length + prefix.length + snippet.length;
  input.focus();
  input.setSelectionRange(cursorPosition, cursorPosition);
}

function wrapSelectedCardContent(tagName, fallbackText) {
  const input = byId("card-pageContent");
  if (!input) return;

  const start = input.selectionStart ?? input.value.length;
  const end = input.selectionEnd ?? input.value.length;
  const selectedText = input.value.slice(start, end);

  if (!selectedText) {
    insertCardContentSnippet(`<${tagName}>${escapeArticleText(fallbackText)}</${tagName}>`);
    return;
  }

  const before = input.value.slice(0, start);
  const after = input.value.slice(end);
  const wrapped = `<${tagName}>${escapeArticleText(selectedText.trim())}</${tagName}>`;

  input.value = `${before}${wrapped}${after}`;
  input.focus();
  input.setSelectionRange(before.length, before.length + wrapped.length);
}

function insertArticleTemplate() {
  insertCardContentSnippet(buildArticleTemplate());
}

function insertArticleHeading() {
  wrapSelectedCardContent("h2", "หัวข้อหลัก");
}

function insertArticleSubheading() {
  wrapSelectedCardContent("h3", "หัวข้อย่อย");
}

function insertArticleBold() {
  wrapSelectedCardContent("strong", "ข้อความที่ต้องการเน้น");
}

async function loadAdminCards() {
  const container = byId("admin-cards");

  try {
    const cards = await window.apiClient.cards.list();
    clearElement(container);

    if (cards.length === 0) {
      container.appendChild(createMessage("ยังไม่มีการ์ด"));
      return;
    }

    cards.forEach((card) => {
      container.appendChild(renderCardItem(card));
    });
  } catch (err) {
    console.error("Error loading cards:", err);
    clearElement(container);
    container.appendChild(createMessage("โหลดการ์ดไม่สำเร็จ กรุณาตรวจสอบ backend"));
  }
}

async function saveCard() {
  if (!token) {
    alert("กรุณา Login ก่อน");
    return;
  }

  const titleVal = byId("card-title").value.trim();
  if (!titleVal) {
    alert("กรุณากรอกหัวข้อ");
    return;
  }

  const data = {
    title: titleVal,
    subtitle: byId("card-subtitle").value.trim(),
    description: byId("card-description").value.trim(),
    imageUrl: byId("card-imageUrl").value.trim(),
    category: byId("card-category").value,
    pageContent: byId("card-pageContent").value
  };

  try {
    const adminToken = await getAdminToken();

    if (editCardId) {
      await window.apiClient.cards.update(editCardId, data, adminToken);
      alert("แก้ไขการ์ดสำเร็จ");
    } else {
      await window.apiClient.cards.create(data, adminToken);
      alert("เพิ่มการ์ดสำเร็จ");
    }

    resetCardForm();
    loadAdminCards();
  } catch (err) {
    console.error("Error saving card:", err);
    alert(`เกิดข้อผิดพลาด: ${err.message}`);
  }
}

async function editCard(id) {
  try {
    const card = await window.apiClient.cards.get(id);

    editCardId = id;
    byId("card-title").value = card.title || "";
    byId("card-subtitle").value = card.subtitle || "";
    byId("card-description").value = card.description || "";
    byId("card-imageUrl").value = card.imageUrl || "";
    byId("card-category").value = card.category || "";
    byId("card-pageContent").value = card.pageContent || "";

    byId("saveCardBtn").innerText = "บันทึกการแก้ไข";
    byId("cancelCardBtn").style.display = "inline-block";

    previewImage();
    byId("tab-cards").scrollIntoView({ behavior: "smooth" });
  } catch (err) {
    alert(`เกิดข้อผิดพลาด: ${err.message}`);
  }
}

async function deleteCard(id) {
  if (!token) return;
  if (!confirm("ยืนยันการลบการ์ดนี้?")) return;

  try {
    const adminToken = await getAdminToken();
    await window.apiClient.cards.delete(id, adminToken);
    alert("ลบการ์ดสำเร็จ");
    loadAdminCards();
  } catch (err) {
    console.error("Error deleting card:", err);
    alert(`เกิดข้อผิดพลาด: ${err.message}`);
  }
}

function resetCardForm() {
  editCardId = null;
  byId("card-title").value = "";
  byId("card-subtitle").value = "";
  byId("card-description").value = "";
  byId("card-imageUrl").value = "";
  byId("card-category").value = "";
  byId("card-pageContent").value = "";

  byId("saveCardBtn").innerText = "เพิ่มการ์ด";
  byId("cancelCardBtn").style.display = "none";
  clearElement(byId("image-preview"));
}

function previewImage() {
  const url = byId("card-imageUrl").value.trim();
  const preview = byId("image-preview");
  clearElement(preview);

  if (!url) return;

  const safeUrl = ui.getSafeImageUrl(url, "");
  if (!safeUrl) return;

  const img = document.createElement("img");
  img.alt = "Preview";
  img.src = safeUrl;
  img.addEventListener("error", () => {
    img.style.display = "none";
  }, { once: true });
  preview.appendChild(img);
}

document.addEventListener("DOMContentLoaded", () => {
  renderLawCategoryOptions();

  const loginButton = byId("loginBtn");
  if (loginButton) {
    loginButton.addEventListener("click", login);
  }

  const passwordInput = byId("password");
  if (passwordInput) {
    passwordInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        login();
      }
    });
  }

  const logoutButton = byId("logoutBtn");
  if (logoutButton) {
    logoutButton.addEventListener("click", logout);
  }

  document.querySelectorAll("[data-admin-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      showTab(button.dataset.adminTab);
    });
  });

  const categorySelect = byId("category");
  if (categorySelect) {
    categorySelect.addEventListener("change", () => {
      resetForm();
      loadAdminLaws();
    });
  }

  const saveLawButton = byId("saveBtn");
  if (saveLawButton) {
    saveLawButton.addEventListener("click", saveLaw);
  }

  const cancelLawButton = byId("cancelLawBtn");
  if (cancelLawButton) {
    cancelLawButton.addEventListener("click", resetForm);
  }

  const saveCardButton = byId("saveCardBtn");
  if (saveCardButton) {
    saveCardButton.addEventListener("click", saveCard);
  }

  const cancelCardButton = byId("cancelCardBtn");
  if (cancelCardButton) {
    cancelCardButton.addEventListener("click", resetCardForm);
  }

  const articleTemplateButton = byId("insertArticleTemplateBtn");
  if (articleTemplateButton) {
    articleTemplateButton.addEventListener("click", insertArticleTemplate);
  }

  const articleHeadingButton = byId("insertArticleHeadingBtn");
  if (articleHeadingButton) {
    articleHeadingButton.addEventListener("click", insertArticleHeading);
  }

  const articleSubheadingButton = byId("insertArticleSubheadingBtn");
  if (articleSubheadingButton) {
    articleSubheadingButton.addEventListener("click", insertArticleSubheading);
  }

  const articleBoldButton = byId("insertArticleBoldBtn");
  if (articleBoldButton) {
    articleBoldButton.addEventListener("click", insertArticleBold);
  }

  const imageInput = byId("card-imageUrl");
  if (imageInput) {
    imageInput.addEventListener("blur", previewImage);
  }
});
