class SPAPlus {
  constructor() {
    this.pages = {};
    this.mode = "hash"; // default
    this.init();
  }

  init() {
    this.detectMode();
    this.collectPages();
    this.bindNavigation();
    this.bindRouting();
    this.render();
  }

  detectMode() {
    if (document.querySelector("spa-use-history")) {
      this.mode = "history";
    }
  }

  collectPages() {
    document.querySelectorAll("spa-page").forEach(page => {
      const name = page.getAttribute("name");
      this.pages[name] = page;
      page.style.display = "none";
    });
  }

  bindRouting() {
    if (this.mode === "hash") {
      window.addEventListener("hashchange", () => this.render());
    } else {
      window.addEventListener("popstate", () => this.render());
    }

    window.addEventListener("load", () => this.render());
  }

  bindNavigation() {
    document.addEventListener("click", e => {
      const link = e.target.closest("[spa-go]");
      if (!link) return;

      e.preventDefault();
      const route = link.getAttribute("spa-go");

      if (this.mode === "hash") {
        location.hash = "/" + route;
      } else {
        history.pushState({}, "", "/" + route);
        this.render();
      }
    });
  }

  getRoute() {
    if (this.mode === "hash") {
      return location.hash.replace("#/", "") || "home";
    } else {
      return location.pathname.replace("/", "") || "home";
    }
  }

  render() {
    const route = this.getRoute();

    Object.values(this.pages).forEach(p => p.style.display = "none");

    if (this.pages[route]) {
      this.pages[route].style.display = "block";
    }
  }
}

new SPAPlus();
