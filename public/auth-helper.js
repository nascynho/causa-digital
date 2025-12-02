/**
 * Sistema de Autenticação e Utilitários - Causa Digital
 * Gerencia login, logout, navegação e notificações
 */

// ========================================
// SISTEMA DE NOTIFICAÇÕES (TOAST)
// ========================================
const Toast = {
  container: null,

  init() {
    if (!this.container) {
      this.container = document.getElementById('toastContainer');
      if (!this.container) {
        this.container = document.createElement('div');
        this.container.className = 'toast-container';
        this.container.id = 'toastContainer';
        document.body.appendChild(this.container);
      }
    }
  },

  show(message, type = 'info', duration = 4000) {
    this.init();
    
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };

    const titles = {
      success: 'Sucesso',
      error: 'Erro',
      warning: 'Atenção',
      info: 'Informação'
    };

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <span class="toast-icon">${icons[type]}</span>
      <div class="toast-content">
        <div class="toast-title">${titles[type]}</div>
        <div class="toast-message">${message}</div>
      </div>
      <button class="toast-close" aria-label="Fechar">&times;</button>
    `;

    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => this.hide(toast));

    this.container.appendChild(toast);

    // Auto-remover após duração
    if (duration > 0) {
      setTimeout(() => this.hide(toast), duration);
    }

    return toast;
  },

  hide(toast) {
    if (!toast || !toast.parentNode) return;
    toast.classList.add('hiding');
    setTimeout(() => toast.remove(), 300);
  },

  success(message, duration) {
    return this.show(message, 'success', duration);
  },

  error(message, duration) {
    return this.show(message, 'error', duration);
  },

  warning(message, duration) {
    return this.show(message, 'warning', duration);
  },

  info(message, duration) {
    return this.show(message, 'info', duration);
  }
};

// ========================================
// SISTEMA DE LOADING
// ========================================
const Loading = {
  show(element) {
    if (!element) return;
    element.style.position = 'relative';
    const overlay = document.createElement('div');
    overlay.className = 'loading-overlay';
    overlay.innerHTML = '<div class="loading-spinner"></div>';
    element.appendChild(overlay);
    return overlay;
  },

  hide(element) {
    if (!element) return;
    const overlay = element.querySelector('.loading-overlay');
    if (overlay) overlay.remove();
  },

  button(btn, loading = true) {
    if (!btn) return;
    if (loading) {
      btn.dataset.originalText = btn.textContent;
      btn.disabled = true;
      btn.innerHTML = '<span class="loading-spinner small" style="display: inline-block; vertical-align: middle; margin-right: 0.5rem;"></span> Aguarde...';
    } else {
      btn.disabled = false;
      btn.textContent = btn.dataset.originalText || 'Enviar';
    }
  }
};

// ========================================
// UTILITÁRIOS DE API
// ========================================
const API = {
  async fetch(url, options = {}) {
    const token = localStorage.getItem('token');
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    };

    try {
      const response = await fetch(url, { ...defaultOptions, ...options });
      
      // Verificar se token expirou
      if (response.status === 401) {
        AuthHelper.logout();
        Toast.error('Sua sessão expirou. Faça login novamente.');
        return null;
      }

      return response;
    } catch (error) {
      console.error('Erro na requisição:', error);
      Toast.error('Erro de conexão. Verifique sua internet.');
      throw error;
    }
  },

  async get(url) {
    return this.fetch(url);
  },

  async post(url, data) {
    return this.fetch(url, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async put(url, data) {
    return this.fetch(url, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  async delete(url) {
    return this.fetch(url, { method: 'DELETE' });
  }
};

// ========================================
// SISTEMA DE AUTENTICAÇÃO
// ========================================
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

  getUserName() {
    return localStorage.getItem("userName") || null;
  },

  setSession(data) {
    if (data.token) localStorage.setItem("token", data.token);
    if (data.userId) {
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("userType", "doador");
    }
    if (data.ongId) {
      localStorage.setItem("ongId", data.ongId);
      localStorage.setItem("userType", "ong");
    }
    if (data.nome) localStorage.setItem("userName", data.nome);
  },

  logout(showToast = true) {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("ongId");
    localStorage.removeItem("userType");
    localStorage.removeItem("userName");
    
    if (showToast) {
      Toast.success('Você saiu da sua conta.');
    }
    
    setTimeout(() => {
      window.location.href = "index.html";
    }, 500);
  },

  updateNavigation() {
    const navLinks = document.querySelector(".nav-links");
    if (!navLinks) return;

    // Remover botões de auth existentes
    navLinks.querySelectorAll(".auth-btn, .auth-link").forEach(btn => btn.remove());
    const modoBtn = navLinks.querySelector("#modoBtn");

    if (this.isLoggedIn()) {
      const userType = this.getUserType();
      const userName = this.getUserName();
      
      // Link para perfil/painel
      const perfilLink = document.createElement("a");
      perfilLink.className = "btn-secondary outline auth-link";
      perfilLink.href = userType === "ong" ? "painel.html" : "perfil.html";
      perfilLink.textContent = userType === "ong" ? "🏢 Painel" : "👤 Perfil";
      if (userName) {
        perfilLink.setAttribute('data-tooltip', `Olá, ${userName}!`);
      }

      // Botão de logout
      const logoutBtn = document.createElement("button");
      logoutBtn.className = "btn-toggle auth-btn";
      logoutBtn.textContent = "🚪";
      logoutBtn.title = "Sair da conta";
      logoutBtn.setAttribute('aria-label', 'Sair da conta');
      logoutBtn.addEventListener("click", () => {
        if (confirm('Deseja realmente sair?')) {
          this.logout();
        }
      });

      if (modoBtn) {
        navLinks.insertBefore(perfilLink, modoBtn);
        navLinks.insertBefore(logoutBtn, modoBtn);
      } else {
        navLinks.appendChild(perfilLink);
        navLinks.appendChild(logoutBtn);
      }
    } else {
      // Link de login
      const entrarLink = document.createElement("a");
      entrarLink.href = "auth.html";
      entrarLink.className = "btn-secondary outline auth-link";
      entrarLink.textContent = "Entrar";

      // Link de cadastro
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
      Toast.warning('Você precisa estar logado para acessar esta página.');
      setTimeout(() => {
        window.location.href = redirectTo;
      }, 1000);
      return false;
    }
    return true;
  },

  requireOng(redirectTo = "auth.html") {
    if (!this.isLoggedIn() || this.getUserType() !== 'ong') {
      Toast.warning('Acesso restrito a ONGs cadastradas.');
      setTimeout(() => {
        window.location.href = redirectTo;
      }, 1000);
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

// ========================================
// VALIDADORES
// ========================================
const Validators = {
  email(value) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value);
  },

  password(value) {
    // Mínimo 8 caracteres, maiúscula, minúscula, número e símbolo
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
    return regex.test(value);
  },

  passwordStrength(value) {
    let strength = 0;
    if (value.length >= 8) strength++;
    if (/[a-z]/.test(value)) strength++;
    if (/[A-Z]/.test(value)) strength++;
    if (/\d/.test(value)) strength++;
    if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value)) strength++;

    const levels = ['', 'weak', 'fair', 'good', 'strong', 'strong'];
    const texts = ['', 'Muito fraca', 'Fraca', 'Boa', 'Forte', 'Muito forte'];

    return {
      level: levels[strength],
      text: texts[strength],
      score: strength
    };
  },

  required(value) {
    return value && value.trim().length > 0;
  },

  minLength(value, min) {
    return value && value.length >= min;
  },

  maxLength(value, max) {
    return value && value.length <= max;
  },

  url(value) {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }
};

// ========================================
// FORMATADORES
// ========================================
const Formatters = {
  currency(value, currency = 'BRL') {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency
    }).format(value);
  },

  number(value) {
    return new Intl.NumberFormat('pt-BR').format(value);
  },

  date(value, options = {}) {
    const defaultOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(value).toLocaleDateString('pt-BR', { ...defaultOptions, ...options });
  },

  dateTime(value) {
    return new Date(value).toLocaleString('pt-BR');
  },

  relativeTime(value) {
    const now = new Date();
    const date = new Date(value);
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Agora mesmo';
    if (minutes < 60) return `Há ${minutes} min`;
    if (hours < 24) return `Há ${hours}h`;
    if (days < 7) return `Há ${days} dias`;
    return this.date(value);
  },

  truncate(text, maxLength = 100) {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }
};

// ========================================
// INICIALIZAÇÃO
// ========================================
AuthHelper.init();

// Exportar para uso global
window.Toast = Toast;
window.Loading = Loading;
window.API = API;
window.AuthHelper = AuthHelper;
window.Validators = Validators;
window.Formatters = Formatters;
