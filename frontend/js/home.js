(function () {
  const ui = window.uiUtils;
  const fallbackCardImage = window.appConstants.images.cardFallback;

  function initBannerSlider() {
    const slider = document.querySelector(".banner-slider");
    const banners = Array.from(document.querySelectorAll(".banner"));
    const prevBtn = document.querySelector(".banner-btn.prev");
    const nextBtn = document.querySelector(".banner-btn.next");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (banners.length === 0 || !prevBtn || !nextBtn) return;

    let current = 0;
    let autoplayId = null;
    const dots = createBannerDots();

    function createBannerDots() {
      if (!slider || banners.length < 2) return [];

      const dotWrap = document.createElement("div");
      dotWrap.className = "banner-dots";
      dotWrap.setAttribute("role", "tablist");
      dotWrap.setAttribute("aria-label", "Banner slides");

      const createdDots = banners.map((banner, index) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "banner-dot";
        dot.setAttribute("role", "tab");
        dot.setAttribute("aria-label", `Show banner ${index + 1}`);
        dot.addEventListener("click", () => {
          current = index;
          showBanner(current);
          stopAutoplay();
          startAutoplay();
        });
        dotWrap.append(dot);
        return dot;
      });

      slider.append(dotWrap);
      return createdDots;
    }

    function showBanner(index) {
      banners.forEach((banner, bannerIndex) => {
        const isActive = bannerIndex === index;
        banner.classList.toggle("active", isActive);
        banner.setAttribute("aria-hidden", String(!isActive));
      });

      dots.forEach((dot, dotIndex) => {
        const isActive = dotIndex === index;
        dot.classList.toggle("active", isActive);
        dot.setAttribute("aria-selected", String(isActive));
        dot.tabIndex = isActive ? 0 : -1;
      });
    }

    function nextBanner() {
      current = (current + 1) % banners.length;
      showBanner(current);
    }

    function prevBanner() {
      current = (current - 1 + banners.length) % banners.length;
      showBanner(current);
    }

    nextBtn.addEventListener("click", nextBanner);
    prevBtn.addEventListener("click", prevBanner);

    function stopAutoplay() {
      if (!autoplayId) return;
      window.clearInterval(autoplayId);
      autoplayId = null;
    }

    function startAutoplay() {
      if (autoplayId || reduceMotion.matches || document.hidden) return;
      autoplayId = window.setInterval(nextBanner, 6000);
    }

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        stopAutoplay();
      } else {
        startAutoplay();
      }
    });

    reduceMotion.addEventListener("change", () => {
      stopAutoplay();
      startAutoplay();
    });

    showBanner(current);
    startAutoplay();
  }

  function initBannerImageFallbacks() {
    document.querySelectorAll(".banner img").forEach((img) => {
      const hideBrokenImage = () => {
        img.classList.add("banner-image-failed");
        img.alt = "";
      };

      img.addEventListener("error", hideBrokenImage);

      if (img.complete && img.naturalWidth === 0) {
        hideBrokenImage();
      }
    });
  }

  function getCardDetailUrl(card) {
    if (card.slug) {
      return `card-detail.html?slug=${encodeURIComponent(card.slug)}`;
    }

    return `card-detail.html?id=${encodeURIComponent(card.id)}`;
  }

  function renderDynamicCard(card) {
    const detailUrl = getCardDetailUrl(card);

    const item = document.createElement("div");
    item.className = "image-card surface-card interactive-lift h-100";
    item.tabIndex = 0;
    item.setAttribute("role", "link");

    const openDetail = () => {
      window.location.href = detailUrl;
    };

    item.addEventListener("click", openDetail);
    item.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openDetail();
      }
    });

    const img = document.createElement("img");
    img.loading = "lazy";
    img.decoding = "async";
    ui.setImageWithFallback(img, card.imageUrl, card.title, fallbackCardImage);

    const body = document.createElement("div");
    body.className = "image-card-body";

    const title = document.createElement("h3");
    title.textContent = card.title || "ไม่มีหัวข้อ";

    const description = document.createElement("p");
    description.textContent = card.subtitle || card.description || "";

    body.append(title, description);
    item.append(img, body);
    return item;
  }

  async function loadDynamicCards() {
    const container = document.getElementById("dynamic-cards");
    if (!container) return;

    if (!window.apiClient) {
      ui.clearElement(container);
      container.append(ui.createBackendNotice(
        "ยังไม่สามารถเชื่อมต่อ Backend ได้",
        "กรุณาตรวจสอบการโหลด API client ก่อนดึง cards มาแสดง"
      ));
      return;
    }

    try {
      const cards = await window.apiClient.cards.list();

      if (cards.length === 0) {
        ui.clearElement(container);
        container.append(ui.createBackendNotice(
          "ยังไม่มีข้อมูล cards จาก Backend",
          "เมื่อเพิ่มข้อมูลผ่าน Backend แล้ว การ์ดจะแสดงในส่วนนี้"
        ));
        return;
      }

      ui.clearElement(container);
      cards.forEach((card) => {
        container.append(renderDynamicCard(card));
      });
    } catch (err) {
      console.error("Error loading cards:", err);
      ui.clearElement(container);
      container.append(ui.createBackendNotice(
        "ยังไม่สามารถเชื่อมต่อ Backend ได้",
        "กรุณารัน backend ก่อน จึงจะดึง cards มาแสดงได้"
      ));
    }
  }

  function initHomePage() {
    initBannerSlider();
    initBannerImageFallbacks();
    loadDynamicCards();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initHomePage, { once: true });
  } else {
    initHomePage();
  }
})();
