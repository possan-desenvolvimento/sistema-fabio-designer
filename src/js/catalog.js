/* =========================================================
   CATÁLOGO — filtros, ordenação e render
========================================================= */

/* ---------- DADOS MOCADOS (depois vira API) ---------- */
const PRODUCTS = [
  { id: 1, name: 'Camisa Básica Preta', category: 'camisas', price: 89.90, sizes: ['P','M','G','GG'], image: 'https://picsum.photos/seed/c1/400/530' },
  { id: 2, name: 'Camisa Oversized Branca', category: 'camisas', price: 119.90, sizes: ['M','G','GG'], image: 'https://picsum.photos/seed/c2/400/530' },
  { id: 3, name: 'Camisa Estampada Rock', category: 'camisas', price: 99.90, sizes: ['P','M','G'], image: 'https://picsum.photos/seed/c3/400/530' },
  { id: 4, name: 'Uniforme Infantil Azul', category: 'uniformes', price: 149.90, sizes: ['P','M','G'], image: 'https://picsum.photos/seed/u1/400/530' },
  { id: 5, name: 'Uniforme Infantil Vermelho', category: 'uniformes', price: 149.90, sizes: ['P','M'], image: 'https://picsum.photos/seed/u2/400/530' },
  { id: 6, name: 'Regata Algodão Masculina', category: 'regatas', price: 59.90, sizes: ['P','M','G','GG'], image: 'https://picsum.photos/seed/r1/400/530' },
  { id: 7, name: 'Regata Algodão Feminina', category: 'regatas', price: 59.90, sizes: ['P','M','G'], image: 'https://picsum.photos/seed/r2/400/530' },
  { id: 8, name: 'Moletom Básico Cinza', category: 'moletons', price: 189.90, sizes: ['P','M','G','GG','XGG'], image: 'https://picsum.photos/seed/m1/400/530' },
  { id: 9, name: 'Moletom Preto Feminino', category: 'moletons', price: 189.90, sizes: ['P','M','G'], image: 'https://picsum.photos/seed/m2/400/530' },
  { id: 10, name: 'Camisa Polo Verde', category: 'camisas', price: 129.90, sizes: ['M','G','GG'], image: 'https://picsum.photos/seed/c4/400/530' },
  { id: 11, name: 'Regata Estampada', category: 'regatas', price: 69.90, sizes: ['P','M','G'], image: 'https://picsum.photos/seed/r3/400/530' },
  { id: 12, name: 'Moletom Oversized Bege', category: 'moletons', price: 209.90, sizes: ['M','G','GG'], image: 'https://picsum.photos/seed/m3/400/530' },
];

/* ---------- HELPERS ---------- */
const formatBRL = (v) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const getParam = (key) => new URLSearchParams(location.search).get(key);

/* ---------- ESTADO ---------- */
const state = {
  search: '',
  category: getParam('cat') || '',
  sizes: [],
  maxPrice: 500,
  sort: 'relevance',
};

/* ---------- FILTRAR ---------- */
function filterProducts() {
  let list = [...PRODUCTS];

  // Busca por nome
  if (state.search) {
    const q = state.search.toLowerCase();
    list = list.filter((p) => p.name.toLowerCase().includes(q));
  }

  // Categoria
  if (state.category) {
    list = list.filter((p) => p.category === state.category);
  }

  // Tamanhos (se algum selecionado, o produto precisa ter TODOS)
  if (state.sizes.length) {
    list = list.filter((p) => state.sizes.every((s) => p.sizes.includes(s)));
  }

  // Preço máximo
  list = list.filter((p) => p.price <= state.maxPrice);

  // Ordenação
  switch (state.sort) {
    case 'price-asc':  list.sort((a, b) => a.price - b.price); break;
    case 'price-desc': list.sort((a, b) => b.price - a.price); break;
    case 'name':       list.sort((a, b) => a.name.localeCompare(b.name)); break;
  }

  return list;
}

/* ---------- RENDER ---------- */
function productCardHTML(p) {
  return `
    <article class="product-card" data-id="${p.id}">
      <a href="product.html?id=${p.id}" class="product-card__media">
        <img src="${p.image}" alt="${p.name}" loading="lazy" />
      </a>
      <div class="product-card__body">
        <h3 class="product-card__title">${p.name}</h3>
        <span class="product-card__price">${formatBRL(p.price)}</span>
        <button class="btn btn--primary" data-add="${p.id}">Adicionar</button>
      </div>
    </article>
  `;
}

function render() {
  const grid  = document.getElementById('product-grid');
  const empty = document.getElementById('catalog-empty');
  const count = document.getElementById('product-count');
  const title = document.getElementById('catalog-title');

  const list = filterProducts();

  if (count) count.textContent = list.length;

  // Atualiza título conforme categoria
  if (title) {
    const catLabels = {
      camisas:   'Camisas',
      uniformes: 'Uniformes Infantis',
      regatas:   'Regatas',
      moletons:  'Moletons',
    };
    title.textContent = state.category ? catLabels[state.category] : 'Catálogo';
  }

  if (!list.length) {
    grid.innerHTML = '';
    empty.hidden = false;
    return;
  }

  empty.hidden = true;
  grid.innerHTML = list.map(productCardHTML).join('');

  // Delegação: botão adicionar ao carrinho
  grid.querySelectorAll('[data-add]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = Number(btn.dataset.add);
      const product = PRODUCTS.find((p) => p.id === id);
      if (!product) return;
      window.FD?.cart?.add({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        qty: 1,
      });
    });
  });
}

/* ---------- SINCRONIZAR UI COM ESTADO ---------- */
function syncUI() {
  // Categoria (radio)
  document.querySelectorAll('input[name="category"]').forEach((r) => {
    r.checked = r.value === state.category;
  });

  // Tamanhos
  document.querySelectorAll('input[name="size"]').forEach((c) => {
    c.checked = state.sizes.includes(c.value);
  });

  // Preço
  const range = document.getElementById('price-range');
  const label = document.getElementById('price-value');
  if (range) range.value = state.maxPrice;
  if (label) label.textContent = formatBRL(state.maxPrice);

  // Ordenação
  const sortSel = document.getElementById('sort-select');
  if (sortSel) sortSel.value = state.sort;
}

/* ---------- INIT ---------- */
function initCatalog() {
  console.log('[catalog.js] inicializando');

  // Busca
  const searchEl = document.getElementById('filter-search');
  searchEl?.addEventListener('input', (e) => {
    state.search = e.target.value.trim();
    render();
  });

  // Categoria
  document.querySelectorAll('input[name="category"]').forEach((r) => {
    r.addEventListener('change', () => {
      state.category = r.value;
      render();
    });
  });

  // Tamanhos
  document.querySelectorAll('input[name="size"]').forEach((c) => {
    c.addEventListener('change', () => {
      state.sizes = [...document.querySelectorAll('input[name="size"]:checked')]
        .map((el) => el.value);
      render();
    });
  });

  // Preço
  const range = document.getElementById('price-range');
  const label = document.getElementById('price-value');
  range?.addEventListener('input', () => {
    state.maxPrice = Number(range.value);
    if (label) label.textContent = formatBRL(state.maxPrice);
    render();
  });

  // Ordenação
  document.getElementById('sort-select')?.addEventListener('change', (e) => {
    state.sort = e.target.value;
    render();
  });

  // Botão aplicar (mobile fecha a gaveta)
  document.getElementById('filters-apply')?.addEventListener('click', () => {
    closeFilters();
  });

  // Limpar filtros
  const clearAll = () => {
    state.search = '';
    state.category = '';
    state.sizes = [];
    state.maxPrice = 500;
    state.sort = 'relevance';

    document.getElementById('filter-search').value = '';
    syncUI();
    render();
  };

  document.getElementById('filters-clear')?.addEventListener('click', clearAll);
  document.getElementById('empty-reset')?.addEventListener('click', clearAll);

  // Filtros mobile
  const filters = document.getElementById('filters');
  const backdrop = document.getElementById('filters-backdrop');
  const openBtn = document.getElementById('filters-toggle');
  const closeBtn = document.getElementById('filters-close');

  openBtn?.addEventListener('click', () => {
    filters.classList.add('is-open');
    backdrop.classList.add('is-open');
  });
  const closeFilters = () => {
    filters.classList.remove('is-open');
    backdrop.classList.remove('is-open');
  };
  closeBtn?.addEventListener('click', closeFilters);
  backdrop?.addEventListener('click', closeFilters);

  // Sync inicial (caso venha ?cat=xxx na URL)
  syncUI();
  render();
}

document.addEventListener('DOMContentLoaded', initCatalog);