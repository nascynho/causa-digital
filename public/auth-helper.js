const AuthHelper = {
  isLoggedIn() {
    return !!(localStorage.getItem("token") && (localStorage.getItem("userId") || localStorage.getItem("ongId")));
  },

  getUserType() {
    return localStorage.getItem("userType") || null;
  },

  getUserId() {
    return localStorage.getItem("userId") || localStorage.getItem("ongId") || null;
  },

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("ongId");
    localStorage.removeItem("userType");
    window.location.href = "index.html";
  },

  updateNavigation() {
    const navLinks = document.querySelector(".nav-links");
    if (!navLinks) return;

    navLinks.querySelectorAll(".auth-btn, .auth-link").forEach(btn => btn.remove());
    const modoBtn = navLinks.querySelector("#modoBtn");

    if (this.isLoggedIn()) {
      const userType = this.getUserType();
      
      const perfilLink = document.createElement("a");
      perfilLink.className = "btn-secondary outline auth-link";
      perfilLink.href = userType === "ong" ? "painel.html" : "perfil.html";
      perfilLink.textContent = userType === "ong" ? "🏢 Meu Painel" : "👤 Meu Perfil";

      const logoutBtn = document.createElement("button");
      logoutBtn.className = "btn-toggle auth-btn";
      logoutBtn.textContent = "🚪";
      logoutBtn.title = "Sair";
      logoutBtn.addEventListener("click", () => this.logout());

      if (modoBtn) {
        navLinks.insertBefore(perfilLink, modoBtn);
        navLinks.insertBefore(logoutBtn, modoBtn);
      } else {
        navLinks.appendChild(perfilLink);
        navLinks.appendChild(logoutBtn);
      }
    } else {
      const entrarLink = document.createElement("a");
      entrarLink.href = "auth.html";
      entrarLink.className = "btn-secondary outline auth-link";
      entrarLink.textContent = "Entrar";

      const criarLink = document.createElement("a");
      criarLink.href = "cadastro.html";
      criarLink.className = "btn-primary auth-link";
      criarLink.textContent = "Criar conta";

      if (modoBtn) {
        navLinks.insertBefore(entrarLink, modoBtn);
        navLinks.insertBefore(criarLink, modoBtn);
      } else {
        navLinks.appendChild(entrarLink);
        navLinks.appendChild(criarLink);
      }
    }
  },

  requireAuth(redirectTo = "auth.html") {
    if (!this.isLoggedIn()) {
      window.location.href = redirectTo;
      return false;
    }
    return true;
  },

  init() {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.updateNavigation());
    } else {
      this.updateNavigation();
    }
  }
};

AuthHelper.init();
