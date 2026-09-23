/* =========================================================
   APP — inicialização global
   - Menu mobile
   - Carrinho lateral (localStorage)
   - Toast de notificação
========================================================= */

/* ---------------------------------------------------------
   TOAST
--------------------------------------------------------- */
export function showToast(message, type = 'info', duration = 2800) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('is-leaving');
    setTimeout(() => toast.remove(), 250);
  }, duration);
}

/* ---------------------------------------------------------
   CARRINHO (localStorage)
--------------------------------------------------------- */
const CART_KEY = 'fabiodesigner:cart';

const cart = {
  get() {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
    catch { return []; }
  },
  set(list) {
    localStorage.setItem(CART_KEY, JSON.stringify(list));
    cart.render();
  },
  add(product) {
    const list = cart.get();
    const existing = list.find((i) => i.id === product.id);
    if (existing) existing.qty += product.qty ?? 1;
    else list.push({ ...product, qty: product.qty ?? 1 });
    cart.set(list);
    showToast('Produto adicionado ao carrinho! 🛒', 'success');
  },
  remove(id) {
    cart.set(cart.get().filter((i) => i.id !== id));
    showToast('Produto removido.', 'info');
  },
  total() {
    return cart.get().reduce((s, i) => s + i.price * i.qty, 0);
  },
  count() {
    return cart.get().reduce((s, i) => s + i.qty, 0);
  },

  /* Renderiza drawer + badge */
  render() {
    const list = cart.get();
    const itemsEl  = document.getElementById('cart-items');
    const totalEl  = document.getElementById('cart-total');
    const countEl  = document.getElementById('cart-count');
    const checkout = document.getElementById('cart-checkout');

    if (countEl) countEl.textContent = cart.count();
    if (totalEl) {
      totalEl.textContent = cart.total().toLocaleString('pt-BR', {
        style: 'currency', currency: 'BRL',
      });
    }

    if (!itemsEl) return;

    if (!list.length) {
      itemsEl.innerHTML = `
        <div class="cart-empty">
          <p>Seu carrinho está vazio.</p>
          <p style="font-size:0.8rem;margin-top:8px;">Adicione produtos pra continuar.</p>
        </div>`;
      if (checkout) checkout.disabled = true;
      return;
    }

    if (checkout) checkout.disabled = false;

    itemsEl.innerHTML = list.map((item) => `
      <div class="cart-item" data-id="${item.id}">
        <img class="cart-item__img" src="${item.image || ''}" alt="${item.name}" />
        <div class="cart-item__info">
          <span class="cart-item__name">${item.name}</span>
          <span style="font-size:0.75rem;color:var(--text-muted);">Qtd: ${item.qty}</span>
          <span class="cart-item__price">
            ${(item.price * item.qty).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </span>
        </div>
        <button class="cart-item__remove" data-remove="${item.id}" aria-label="Remover">✕</button>
      </div>
    `).join('');

    itemsEl.querySelectorAll('[data-remove]').forEach((btn) => {
      btn.addEventListener('click', () => cart.remove(btn.dataset.remove));
    });
  },
};

/* ---------------------------------------------------------
   MENU MOBILE
--------------------------------------------------------- */
function initMenu() {
  const btn  = document.getElementById('menu-toggle');
  const menu = document.getElementById('menu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => menu.classList.toggle('is-open'));

  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && !btn.contains(e.target)) {
      menu.classList.remove('is-open');
    }
  });
}

/* ---------------------------------------------------------
   DRAWER DO CARRINHO
--------------------------------------------------------- */
function initCartDrawer() {
  const drawer   = document.getElementById('cart-drawer');
  const backdrop = document.getElementById('cart-backdrop');
  const openBtn  = document.getElementById('cart-btn');
  const closeBtn = document.getElementById('cart-close');
  const checkout = document.getElementById('cart-checkout');

  const open  = () => {
    drawer?.classList.add('is-open');
    backdrop?.classList.add('is-open');
  };
  const close = () => {
    drawer?.classList.remove('is-open');
    backdrop?.classList.remove('is-open');
  };

  openBtn?.addEventListener('click', open);
  closeBtn?.addEventListener('click', close);
  backdrop?.addEventListener('click', close);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });

  checkout?.addEventListener('click', () => {
    showToast('Em breve: integração com o checkout 🚀', 'info');
  });
}

/* ---------------------------------------------------------
   INICIALIZAÇÃO
--------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  initMenu();
  initCartDrawer();
  cart.render();
  console.log('[app.js] FabioDesigner pronto ✔');
});

/* Expõe globalmente para outras páginas usarem */
window.FD = { cart, showToast };