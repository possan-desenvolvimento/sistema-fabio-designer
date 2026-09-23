/* =========================================================
   UNIFORMES — filtros, sub-categorias e render
========================================================= */

/* ---------- PRODUTOS MOCADOS ---------- */
const PRODUCTS = [
  {
    id: 201,
    name: 'Uniforme Infantil Azul',
    subcat: 'masculino',
    price: 189.90,
    sizes: ['4','6','8','10','12'],
    colors: ['azul'],
    image: 'https://picsum.photos/seed/unif1/500/660',
  },
  {
    id: 202,
    name: 'Uniforme Infantil Vermelho',
    subcat: 'masculino',
    price: 189.90,
    oldPrice: 219.90,
    sizes: ['4','6','8','10'],
    colors: ['vermelho'],
    image: 'https://picsum.photos/seed/unif2/500/660',
  },
  {
    id: 203,
    name: 'Uniforme Feminino Rosa',
    subcat: 'feminino',
    price: 199.90,
    sizes: ['4','6','8','10','12'],
    colors: ['vermelho'],
    image: 'https://picsum.photos/seed/unif3/500/660',
  },
  {
    id: 204,
    name: 'Kit Completo Verde',
    subcat: 'kit',
    price: 259.90,
    oldPrice: 299.90,
    sizes: ['6','8','10','12','14'],
    colors: ['verde'],
    image: 'https://picsum.photos/seed/unif4/500/660',
  },
  {
    id: 205,
    name: 'Uniforme Infantil Amarelo',
    subcat: 'masculino',
    price: 189.90,
    sizes: ['4','6','8','10'],
    colors: ['amarelo'],
    image: 'https://picsum.photos/seed/unif5/500/660',
  },
  {
    id: 206,
    name: 'Kit Completo Azul Marinho',
    subcat: 'kit',
    price: 269.90,
    sizes: ['6','8','10','12'],
    colors: ['azul','preto'],
    image: 'https://picsum.photos/seed/unif6/500/660',
  },
  {
    id: 207,
    name: 'Uniforme Feminino Roxo',
    subcat: 'feminino',
    price: 199.90,
    sizes: ['4','6','8','10'],
    colors: ['azul'],
    image: 'https://picsum.photos/seed/unif7/500/660',
  },
  {
    id: 208,
    name: 'Kit Completo Preto/Dourado',
    subcat: 'kit',
    price: 289.90,
    sizes: ['8','10','12','14'],
    colors: ['preto'],
    image: 'https://picsum.photos/seed/unif8/500/660',
  },
  {
    id: 209,
    name: 'Uniforme Infantil Branco',
    subcat: 'masculino',
    price: 189.90,
    sizes: ['4','6','8','10','12'],
    colors: ['branco'],
    image: 'https://picsum.photos/seed/unif9/500/660',
  },
  {
    id: 210,
    name: 'Kit Completo Vermelho',
    subcat: 'kit',
    price: 259.90,
    oldPrice: 299.90,
    sizes: ['6','8','10','12'],
    colors: ['vermelho','preto'],
    image: 'https://picsum.photos/seed/unif10/500/660',
  },
];

/* ---------- HELPERS ---------- */
const formatBRL = (v) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

/* ---------- ESTADO ---------- */
const state = {
  search: '',
  subcat: '',
  sizes: [],
  colors: [],
  maxPrice: 400,
  sort: 'relevance',
};

/* ---------- FILTRO ---------- */
function filterProducts() {
  let list = [...PRODUCTS];

  if (state.search) {
    const q = state.search.toLowerCase();
    list = list.filter((p) => p.name.toLowerCase().includes(q));
  }

  if (state.subcat) {
    list = list.filter((p) => p.subcat === state.subcat);
  }

  if (state.sizes.length) {
    list = list.filter((p) => state.sizes.every((s) => p.sizes.includes(s)));
  }

  if (state.colors.length) {
    list = list.filter((p) => state.colors.some((c) => p.colors.includes(c)));
  }

  list = list.filter((p) => p.price <= state.maxPrice);

  switch (state.sort) {
    case 'price-asc':  list.sort((a, b) => a.price - b.price); break;
    case 'price-desc': list.sort((a, b) => b.price - a.price); break;
    case 'name':       list.sort((a, b) => a.name.localeCompare(b.name)); break;
  }

  return list;
}

/* ---------- RENDER CARD ---------- */
function cardHTML(p) {
  const oldPrice = p.oldPrice
    ? `<span class="product-card__old">${formatBRL(p.oldPrice)}</span>`
    : '';

  const sizes = p.sizes.map((s) => `<span class="size-tag">${s}</span>`).join('');

  return `
    <article class="product-card" data-id="${p.id}">
      <div class="product-card__media">
        <img src="${p.image}" alt="${p.name}" loading="lazy" />
      </div>
      <div class="product-card__body">
        <h3 class="product-card__title">${p.name}</h3>
        <div class="product-card__sizes">${sizes}</div>
        <div class="product-card__prices">
          ${oldPrice}
          <span class="product-card__price">${formatBRL(p.price)}</span>
        </div>
        <button class="btn btn--primary" data-add="${p.id}">Adicionar</button>
      </div>
    </article>
  `;
}

/* ---------- RENDER ---------- */
function render() {
  const grid  = document.getElementById('product-grid');
  const empty = document.getElementById('cat-empty');
  const count = document.getElementById('product-count');

  const list = filterProducts();

  if (count) count.textContent = list.length;

  if (!list.length) {
    grid.innerHTML = '';
    empty.hidden = false;
    return;
  }

  empty.hidden = true;
  grid.innerHTML = list.map(cardHTML).join('');

  grid.querySelectorAll('[data-add]').forEach((btn) => {
    btn.addEventListener('click', () => {
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

/* ---------- SUB-CATEGORIAS ---------- */
function initSubcats() {
  document.querySelectorAll('.subcat-chip').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.subcat-chip').forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      state.subcat = btn.dataset.subcat || '';
      render();
    });
  });
}

/* ---------- FILTROS ---------- */
function initFilters() {
  document.getElementById('filter-search')?.addEventListener('input', (e) => {
    state.search = e.target.value.trim();
    render();
  });

  document.querySelectorAll('input[name="size"]').forEach((c) => {
    c.addEventListener('change', () => {
      state.sizes = [...document.querySelectorAll('input[name="size"]:checked')]
        .map((el) => el.value);
      render();
    });
  });

  document.querySelectorAll('input[name="color"]').forEach((c) => {
    c.addEventListener('change', () => {
      state.colors = [...document.querySelectorAll('input[name="color"]:checked')]
        .map((el) => el.value);
      render();
    });
  });

  const range = document.getElementById('price-range');
  const label = document.getElementById('price-value');
  range?.addEventListener('input', () => {
    state.maxPrice = Number(range.value);
    if (label) label.textContent = formatBRL(state.maxPrice);
    render();
  });

  document.getElementById('sort-select')?.addEventListener('change', (e) => {
    state.sort = e.target.value;
    render();
  });

  const clearAll = () => {
    state.search = '';
    state.subcat = '';
    state.sizes = [];
    state.colors = [];
    state.maxPrice = 400;
    state.sort = 'relevance';

    document.getElementById('filter-search').value = '';
    document.querySelectorAll('input[name="size"]').forEach((c) => (c.checked = false));
    document.querySelectorAll('input[name="color"]').forEach((c) => (c.checked = false));
    document.querySelectorAll('.subcat-chip').forEach((b) => b.classList.remove('is-active'));
    document.querySelector('.subcat-chip[data-subcat=""]')?.classList.add('is-active');

    if (range) range.value = 400;
    if (label) label.textContent = formatBRL(400);
    document.getElementById('sort-select').value = 'relevance';

    render();
  };

  document.getElementById('filters-clear')?.addEventListener('click', clearAll);
  document.getElementById('empty-reset')?.addEventListener('click', clearAll);

  const filters = document.getElementById('filters');
  const backdrop = document.getElementById('filters-backdrop');
  const openBtn = document.getElementById('filters-toggle');
  const closeBtn = document.getElementById('filters-close');

  const closeFilters = () => {
    filters.classList.remove('is-open');
    backdrop.classList.remove('is-open');
  };

  openBtn?.addEventListener('click', () => {
    filters.classList.add('is-open');
    backdrop.classList.add('is-open');
  });
  closeBtn?.addEventListener('click', closeFilters);
  backdrop?.addEventListener('click', closeFilters);
  document.getElementById('filters-apply')?.addEventListener('click', closeFilters);
}

/* ---------- INIT ---------- */
function init() {
  console.log('[uniformes.js] inicializando');
  initSubcats();
  initFilters();
  render();
}

document.addEventListener('DOMContentLoaded', init);