(function () {
  const TEXT = {
    copy: "\u0e04\u0e31\u0e14\u0e25\u0e2d\u0e01",
    copied: "\u0e04\u0e31\u0e14\u0e25\u0e2d\u0e01\u0e41\u0e25\u0e49\u0e27",
    copiedLink: "\u0e04\u0e31\u0e14\u0e25\u0e2d\u0e01\u0e25\u0e34\u0e07\u0e01\u0e4c\u0e41\u0e25\u0e49\u0e27",
    copyContact: "Copy contact information",
    copyLaw: "Copy law summary",
    copyHeading: "Copy section link"
  };

  const revealSelector = [
    ".banner-slider",
    ".category-card",
    ".line-consult",
    ".extra-content",
    ".image-card",
    ".consult-card",
    ".law-card",
    ".law-message",
    ".card-hero",
    ".card-body",
    ".back-section",
    ".admin-login",
    ".top-bar",
    ".admin-tabs",
    ".workspace-panel",
    ".law-item",
    ".card-item",
    ".backend-required"
  ].join(",");

  const pressableSelector = [
    "a.btn",
    "button",
    ".interactive-lift",
    ".banner",
    ".line-float",
    ".links a"
  ].join(",");

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let revealObserver = null;
  let mutationObserver = null;
  let progressFrame = null;
  let toastTimer = null;

  function onReady(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback, { once: true });
    } else {
      callback();
    }
  }

  function collect(root, selector) {
    const items = [];

    if (root.nodeType === Node.ELEMENT_NODE && root.matches(selector)) {
      items.push(root);
    }

    if (root.querySelectorAll) {
      root.querySelectorAll(selector).forEach((item) => items.push(item));
    }

    return items;
  }

  function showToast(message) {
    let toast = document.querySelector(".action-toast");

    if (!toast) {
      toast = document.createElement("div");
      toast.className = "action-toast";
      toast.setAttribute("role", "status");
      toast.setAttribute("aria-live", "polite");
      document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.classList.add("show");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      toast.classList.remove("show");
    }, 1600);
  }

  function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).catch(() => fallbackCopyToClipboard(text));
    }

    return fallbackCopyToClipboard(text);
  }

  function fallbackCopyToClipboard(text) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.top = "-999px";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
    return Promise.resolve();
  }

  function cleanCopyText(element) {
    const clone = element.cloneNode(true);
    clone.querySelectorAll(".contact-copy-btn, .law-copy-btn, .heading-link-btn").forEach((button) => {
      button.remove();
    });
    return clone.textContent.replace(/\s+/g, " ").trim();
  }

  function setCopiedState(button, message) {
    if (!button.dataset.originalText) {
      button.dataset.originalText = button.textContent;
    }

    button.textContent = TEXT.copied;
    button.classList.add("is-copied");
    showToast(message || TEXT.copied);

    window.setTimeout(() => {
      button.textContent = button.dataset.originalText || TEXT.copy;
      button.classList.remove("is-copied");
    }, 1400);
  }

  function updateScrollProgress(progressBar) {
    const maxScroll = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight
    ) - window.innerHeight;
    const progress = maxScroll > 0
      ? Math.min(Math.max(window.scrollY / maxScroll, 0), 1)
      : 0;

    progressBar.style.setProperty("--scroll-progress", progress.toFixed(4));
    progressFrame = null;
  }

  function initScrollProgress() {
    if (document.querySelector(".action-scroll-progress")) return;

    const wrapper = document.createElement("div");
    const bar = document.createElement("span");
    wrapper.className = "action-scroll-progress";
    wrapper.setAttribute("aria-hidden", "true");
    wrapper.appendChild(bar);
    document.body.appendChild(wrapper);

    const requestUpdate = () => {
      if (progressFrame !== null) return;
      progressFrame = window.requestAnimationFrame(() => updateScrollProgress(bar));
    };

    requestUpdate();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
  }

  function markCurrentNav() {
    const current = new URL(window.location.href);
    const currentFile = current.pathname.split("/").pop() || "home.html";

    document.querySelectorAll(".nav-links a").forEach((link) => {
      const href = new URL(link.getAttribute("href"), window.location.href);
      const hrefFile = href.pathname.split("/").pop() || "home.html";
      const matchesPath = hrefFile === currentFile;
      const matchesSearch = !href.search || href.search === current.search;
      const isHomeRoot = currentFile === "" && hrefFile === "home.html";
      const isConsultAlias = currentFile === "consult.html"
        && hrefFile === "card-detail.html"
        && href.search === "?slug=consult";
      const isCurrent = (matchesPath && matchesSearch) || isHomeRoot || isConsultAlias;

      link.classList.toggle("is-current", isCurrent);

      if (isCurrent) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  function prepareReveal(root) {
    const items = collect(root, revealSelector);

    items.forEach((item) => {
      if (item.dataset.actionReveal === "ready") return;

      item.dataset.actionReveal = "ready";

      if (!revealObserver || reduceMotion.matches) {
        item.classList.add("is-visible");
        return;
      }

      revealObserver.observe(item);
    });

    document.documentElement.classList.add("action-effects-ready");
  }

  function initReveal() {
    if ("IntersectionObserver" in window && !reduceMotion.matches) {
      revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        });
      }, {
        rootMargin: "0px 0px -8% 0px",
        threshold: 0.12
      });
    }

    prepareReveal(document);

    const onMotionChange = () => {
      if (!reduceMotion.matches) return;
      document.querySelectorAll("[data-action-reveal]").forEach((item) => {
        item.classList.add("is-visible");
      });
    };

    if (reduceMotion.addEventListener) {
      reduceMotion.addEventListener("change", onMotionChange);
    } else {
      reduceMotion.addListener(onMotionChange);
    }
  }

  function preparePressables(root) {
    collect(root, pressableSelector).forEach((element) => {
      if (element.classList.contains("action-pressable")) return;
      element.classList.add("action-pressable");

      if (window.getComputedStyle(element).position === "static") {
        element.classList.add("action-pressable-positioned");
      }
    });
  }

  function pressElement(element, clientX, clientY) {
    if (!element || element.matches(":disabled, [aria-disabled='true']")) return;

    const rect = element.getBoundingClientRect();
    const x = Number.isFinite(clientX) ? clientX - rect.left : rect.width / 2;
    const y = Number.isFinite(clientY) ? clientY - rect.top : rect.height / 2;

    element.style.setProperty("--press-x", `${x}px`);
    element.style.setProperty("--press-y", `${y}px`);
    element.classList.remove("is-pressed");
    void element.offsetWidth;
    element.classList.add("is-pressed");

    window.setTimeout(() => {
      element.classList.remove("is-pressed");
    }, 520);
  }

  function bindPressFeedback() {
    document.addEventListener("pointerdown", (event) => {
      if (event.button > 0) return;
      const element = event.target.closest(".action-pressable");
      if (!element) return;
      pressElement(element, event.clientX, event.clientY);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      const element = event.target.closest(".action-pressable");
      if (!element) return;
      pressElement(element, NaN, NaN);
    });
  }

  function decorateConsultContacts(root) {
    collect(root, ".consult-card .contact").forEach((contact) => {
      if (contact.dataset.copyReady === "true") return;

      contact.dataset.copyReady = "true";
      contact.classList.add("has-copy-action");

      const button = document.createElement("button");
      button.type = "button";
      button.className = "contact-copy-btn action-pressable";
      button.textContent = TEXT.copy;
      button.setAttribute("aria-label", TEXT.copyContact);

      button.addEventListener("click", (event) => {
        event.stopPropagation();
        copyToClipboard(cleanCopyText(contact)).then(() => {
          setCopiedState(button);
        });
      });

      contact.appendChild(button);
    });
  }

  function decorateLawCards(root) {
    collect(root, ".law-card").forEach((card) => {
      if (card.dataset.copyReady === "true") return;

      card.dataset.copyReady = "true";
      card.classList.add("has-copy-action");

      const button = document.createElement("button");
      button.type = "button";
      button.className = "law-copy-btn action-pressable";
      button.textContent = TEXT.copy;
      button.setAttribute("aria-label", TEXT.copyLaw);

      button.addEventListener("click", (event) => {
        event.stopPropagation();
        copyToClipboard(cleanCopyText(card)).then(() => {
          setCopiedState(button);
        });
      });

      card.appendChild(button);
    });
  }

  function getHeadingId(heading, index) {
    if (heading.id) return heading.id;

    const text = heading.textContent.trim() || `section-${index + 1}`;
    let hash = 0;

    for (let i = 0; i < text.length; i += 1) {
      hash = ((hash * 31) + text.charCodeAt(i)) >>> 0;
    }

    return `section-${hash.toString(36)}`;
  }

  function decorateDetailHeadings(root) {
    const contentScopes = collect(root, ".card-content");

    if (root.nodeType === Node.ELEMENT_NODE && root.closest) {
      const parentContent = root.matches(".card-content") ? root : root.closest(".card-content");
      if (parentContent && !contentScopes.includes(parentContent)) {
        contentScopes.push(parentContent);
      }
    }

    contentScopes.forEach((content) => {
      content.querySelectorAll("h2, h3").forEach((heading, index) => {
        if (heading.dataset.linkReady === "true") return;

        heading.dataset.linkReady = "true";
        heading.id = getHeadingId(heading, index);

        const button = document.createElement("button");
        button.type = "button";
        button.className = "heading-link-btn action-pressable";
        button.textContent = "#";
        button.title = TEXT.copyHeading;
        button.setAttribute("aria-label", TEXT.copyHeading);

        button.addEventListener("click", (event) => {
          event.preventDefault();
          event.stopPropagation();
          const url = `${window.location.origin}${window.location.pathname}${window.location.search}#${heading.id}`;
          copyToClipboard(url).then(() => {
            setCopiedState(button, TEXT.copiedLink);
          });
        });

        heading.appendChild(button);
      });
    });
  }

  function refresh(root) {
    const scope = root || document;
    preparePressables(scope);
    prepareReveal(scope);
    decorateConsultContacts(scope);
    decorateLawCards(scope);
    decorateDetailHeadings(scope);
    markCurrentNav();
  }

  function initMutationObserver() {
    if (mutationObserver || !document.body) return;

    mutationObserver = new MutationObserver((records) => {
      records.forEach((record) => {
        record.addedNodes.forEach((node) => {
          if (node.nodeType !== Node.ELEMENT_NODE) return;
          refresh(node);
        });
      });
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  window.appActions = {
    refresh,
    showToast
  };

  onReady(() => {
    initScrollProgress();
    initReveal();
    bindPressFeedback();
    refresh(document);
    initMutationObserver();
  });
})();
