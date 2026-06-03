// viewer.js - ดูกฎหมายตามหมวดผ่าน Backend API

const params = new URLSearchParams(window.location.search);
const category = params.get("category");

if (!category) {
  window.location.replace("home.html");
}

const titles = {
  computer: "กฎหมายคอมพิวเตอร์",
  privacy: "กฎหมายคุ้มครองข้อมูลส่วนบุคคล (PDPA)",
  copyright: "กฎหมายลิขสิทธิ์"
};

document.getElementById("law-title").textContent =
  titles[category] || "กฎหมาย";

function showLawMessage(container, message) {
  const paragraph = document.createElement("p");
  paragraph.textContent = message;
  container.replaceChildren(paragraph);
}

function renderLawCard(law) {
  const div = document.createElement("div");
  div.className = "law-card";

  const heading = document.createElement("h3");
  heading.textContent = `${law.section || ""} : ${law.title || ""}`;

  const description = document.createElement("p");
  description.textContent = law.description || "";

  div.append(heading, description);

  if (law.penalty && law.penalty.trim() !== "") {
    const penalty = document.createElement("div");
    penalty.className = "penalty";
    penalty.textContent = `โทษ: ${law.penalty}`;
    div.append(penalty);
  }

  return div;
}

async function loadLaws() {
  const container = document.getElementById("law-list");

  try {
    const laws = await window.apiClient.laws.list(category);
    container.replaceChildren();

    laws.forEach((law) => {
      container.appendChild(renderLawCard(law));
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
  loadLaws();
}
