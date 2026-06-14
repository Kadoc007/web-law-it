(function () {
  const NAV_ITEMS = [
    { href: "home.html", label: "Home" },
    { href: "card-detail.html?slug=consult", label: "ศูนย์รับปรึกษากฎหมาย" },
    { href: "admin.html", label: "Login" },
  ];

  let teardownNavbarInteractions = () => {};

  function populateMenu(list) {
    list.replaceChildren();

    NAV_ITEMS.forEach((item) => {
      const listItem = document.createElement("li");
      const link = document.createElement("a");
      link.href = item.href;
      link.textContent = item.label;
      listItem.append(link);
      list.append(listItem);
    });
  }

  function createNavbarShell() {
    const nav = document.createElement("nav");
    nav.className = "navbar app-navbar";

    const wrapper = document.createElement("div");
    wrapper.className = "container-xl nav-container";

    const logo = document.createElement("a");
    logo.className = "logo";
    logo.href = "home.html";

    const mark = document.createTextNode("⚖️ ");
    const label = document.createElement("span");
    label.textContent = "IT LAW CENTER";
    logo.append(mark, label);

    const toggle = document.createElement("button");
    toggle.className = "menu-toggle";
    toggle.type = "button";
    toggle.setAttribute("aria-label", "Open navigation menu");
    toggle.setAttribute("aria-controls", "navMenu");
    toggle.setAttribute("aria-expanded", "false");

    const toggleLines = document.createElement("span");
    toggleLines.className = "menu-toggle-lines";
    toggleLines.setAttribute("aria-hidden", "true");
    toggle.append(toggleLines);

    const list = document.createElement("ul");
    list.className = "nav-links";
    list.id = "navMenu";
    list.setAttribute("aria-label", "Primary navigation");
    populateMenu(list);

    wrapper.append(logo, toggle, list);
    nav.append(wrapper);
    return nav;
  }

  function parseNavbar(html) {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.querySelector(".app-navbar");
  }

  function bindNavbarInteractions(container) {
    const toggle = container.querySelector(".menu-toggle");
    const menu = container.querySelector("#navMenu");

    if (!toggle || !menu) return;

    teardownNavbarInteractions();

    const controller = new AbortController();
    const listenerOptions = { signal: controller.signal };
    const desktopQuery = window.matchMedia("(min-width: 901px)");

    const closeMenu = () => {
      menu.classList.remove("show");
      toggle.setAttribute("aria-expanded", "false");
    };

    toggle.addEventListener("click", (event) => {
      event.stopPropagation();
      const isOpen = menu.classList.toggle("show");
      toggle.setAttribute("aria-expanded", String(isOpen));
    }, listenerOptions);

    menu.addEventListener("click", (event) => {
      if (event.target.closest("a")) {
        closeMenu();
      }
    }, listenerOptions);

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    }, listenerOptions);

    document.addEventListener("click", (event) => {
      if (!container.contains(event.target)) {
        closeMenu();
      }
    }, listenerOptions);

    window.addEventListener("resize", () => {
      if (desktopQuery.matches) {
        closeMenu();
      }
    }, listenerOptions);

    teardownNavbarInteractions = () => controller.abort();
  }

  function loadNavbar() {
    const container = document.getElementById("navbar");
    if (!container) return;

    if (!container.querySelector(".app-navbar")) {
      container.replaceChildren(createNavbarShell());
      bindNavbarInteractions(container);
    }

    fetch("components/navbar.html")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Navbar component could not be loaded");
        }
        return response.text();
      })
      .then((html) => {
        const fetchedNavbar = parseNavbar(html);
        if (!fetchedNavbar) {
          throw new Error("Navbar component markup is invalid");
        }
        const menu = fetchedNavbar.querySelector("#navMenu");
        if (menu) {
          populateMenu(menu);
        }
        container.replaceChildren(fetchedNavbar);
        bindNavbarInteractions(container);
      })
      .catch((err) => {
        console.error("Error loading navbar:", err);
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadNavbar, { once: true });
  } else {
    loadNavbar();
  }
})();
