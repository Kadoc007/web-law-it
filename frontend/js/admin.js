// admin.js - Admin Panel ผ่าน Backend API

let token = "";
let editId = null;
let editCardId = null;

const adminImageFallback = "https://via.placeholder.com/80x60?text=No+Image";

function byId(id) {
  return document.getElementById(id);
}

function clearElement(element) {
  element.replaceChildren();
}

function createMessage(message) {
  const paragraph = document.createElement("p");
  paragraph.style.textAlign = "center";
  paragraph.style.color = "#888";
  paragraph.textContent = message;
  return paragraph;
}

function setImageWithFallback(img, src, alt, fallbackSrc = adminImageFallback) {
  img.alt = alt || "";
  img.src = getSafeImageUrl(src, fallbackSrc);
  img.addEventListener("error", () => {
    if (img.src !== fallbackSrc) {
      img.src = fallbackSrc;
    }
  }, { once: true });
}

function getSafeImageUrl(src, fallbackSrc = adminImageFallback) {
  if (!src) return fallbackSrc;

  try {
    const url = new URL(src, window.location.href);
    if (url.protocol === "http:" || url.protocol === "https:") {
      return url.href;
    }
  } catch (err) {
    console.warn("Invalid image URL:", err);
  }

  return fallbackSrc;
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
  byId("login-box").style.display = "block";
  clearElement(byId("admin-laws"));
  clearElement(byId("admin-cards"));

  resetForm();
  resetCardForm();
}

function showTab(tabName) {
  const buttons = document.querySelectorAll(".tab-btn");
  buttons.forEach((btn, index) => {
    const isActive = (tabName === "laws" && index === 0) || (tabName === "cards" && index === 1);
    btn.classList.toggle("active", isActive);
  });

  document.querySelectorAll(".tab-content").forEach((content) => {
    content.classList.remove("active");
  });
  byId(`tab-${tabName}`).classList.add("active");

  if (tabName === "laws") {
    loadAdminLaws();
  } else if (tabName === "cards") {
    loadAdminCards();
  }
}

function togglePenalty() {
  const category = byId("category").value;
  const penaltyInput = byId("penalty");

  if (category === "privacy") {
    penaltyInput.style.display = "none";
    penaltyInput.value = "";
  } else {
    penaltyInput.style.display = "block";
  }
}

function renderLawItem(law) {
  const item = document.createElement("div");
  item.className = "law-item";

  const text = document.createElement("div");
  text.className = "law-text";

  const section = document.createElement("b");
  section.textContent = law.section || "";
  text.append(section, document.createTextNode(` - ${law.title || ""}`));

  const actions = document.createElement("div");
  actions.className = "action-buttons";

  const editButton = document.createElement("button");
  editButton.className = "edit-btn";
  editButton.type = "button";
  editButton.textContent = "แก้ไข";
  editButton.addEventListener("click", () => editLaw(law));

  const deleteButton = document.createElement("button");
  deleteButton.className = "danger";
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
    const laws = await window.apiClient.laws.list(category);
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
  const data = {
    section: byId("section").value,
    title: byId("title").value,
    description: byId("description").value
  };

  if (category !== "privacy") {
    data.penalty = byId("penalty").value;
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
  byId("section").value = law.section || "";
  byId("title").value = law.title || "";
  byId("description").value = law.description || "";
  byId("penalty").value = law.penalty || "";
  byId("saveBtn").innerText = "บันทึกการแก้ไข";

  togglePenalty();
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
  byId("section").value = "";
  byId("title").value = "";
  byId("description").value = "";
  byId("penalty").value = "";
  byId("saveBtn").innerText = "เพิ่มข้อมูล";

  togglePenalty();
}

function getCategoryLabel(category) {
  const labels = {
    help: "ศูนย์ช่วยเหลือ",
    article: "บทความ",
    resource: "แหล่งข้อมูล"
  };
  return labels[category] || category;
}

function renderCardItem(card) {
  const item = document.createElement("div");
  item.className = "card-item";

  const img = document.createElement("img");
  img.className = "card-item-image";
  setImageWithFallback(img, card.imageUrl, card.title);

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
    badge.className = "card-item-category";
    badge.textContent = getCategoryLabel(card.category);
    info.appendChild(badge);
  }

  const actions = document.createElement("div");
  actions.className = "action-buttons";

  const editButton = document.createElement("button");
  editButton.className = "edit-btn";
  editButton.type = "button";
  editButton.textContent = "แก้ไข";
  editButton.addEventListener("click", () => editCard(card.id));

  const deleteButton = document.createElement("button");
  deleteButton.className = "danger";
  deleteButton.type = "button";
  deleteButton.textContent = "ลบ";
  deleteButton.addEventListener("click", () => deleteCard(card.id));

  actions.append(editButton, deleteButton);
  item.append(img, info, actions);
  return item;
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
    slug: byId("card-slug").value.trim(),
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
    byId("card-slug").value = card.slug || "";
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
  byId("card-slug").value = "";
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

  const safeUrl = getSafeImageUrl(url, "");
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
  const imageInput = byId("card-imageUrl");
  if (imageInput) {
    imageInput.addEventListener("blur", previewImage);
  }
});
