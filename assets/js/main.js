// assets/js/main.js
document.addEventListener("DOMContentLoaded", () => {
  applyStoredBg();             // <- apply saved background first
  initClock();                 // Task 5
  initChangeBg();              // Task 4
  initProductsAddToCart();     // Products → Add to Cart
  initCartPage();              // Cart +/- и subtotal
  initFormValidation();        // Task 1
});

/* ---------- Task 5: Date & Time ---------- */
function initClock() {
  const el = document.getElementById("clock");
  if (!el) return;
  const fmt = (d) => d.toLocaleString("en-US", {
    year: "numeric", month: "long", day: "numeric",
    hour: "numeric", minute: "2-digit", hour12: true
  });
  const tick = () => (el.textContent = fmt(new Date()));
  tick();
  setInterval(tick, 1000);
}

/* ---------- Task 4: Change Background (устойчиво + с памятью) ---------- */
const STORAGE_BG = "se_bg_color";

function setPageBg(color) {
  // 1) Save the choice
  try { localStorage.setItem(STORAGE_BG, color); } catch (_) {}

  // 2) Stop gradient and paint solid
  document.body.classList.remove('bg-animated');
  document.documentElement.style.setProperty('--page-bg', color);
  document.documentElement.style.setProperty('background', color, 'important');
  document.body.style.setProperty('animation', 'none', 'important');
  document.body.style.setProperty('backgroundImage', 'none', 'important');
  document.body.style.setProperty('background', color, 'important');
}

function applyStoredBg() {
  let saved = null;
  try { saved = localStorage.getItem(STORAGE_BG); } catch (_) {}
  if (saved) {
    // If user chose a color before, use it and disable gradient
    document.body.classList.remove('bg-animated');
    document.documentElement.style.setProperty('--page-bg', saved);
    document.documentElement.style.setProperty('background', saved, 'important');
    document.body.style.setProperty('animation', 'none', 'important');
    document.body.style.setProperty('backgroundImage', 'none', 'important');
    document.body.style.setProperty('background', saved, 'important');
  }
}

function initChangeBg() {
  // Soft pastel palette
  const colors = ["#ffeaea", "#ffd6d6", "#fff5f5", "#ffefef", "#fff0f0", "#f4f9ff", "#f7fff4"];
  let i = 0;

  // поддерживаем любые варианты кнопок:
  const candidates = ['#changeColorBtn', '#bgBtn', '[data-role="change-bg"]'];

  const buttons = candidates
    .map(sel => Array.from(document.querySelectorAll(sel)))
    .flat()
    .filter((v, idx, arr) => arr.indexOf(v) === idx);

  if (!buttons.length) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const color = colors[i++ % colors.length];
      setPageBg(color);
    });

    // (опционально) Правый клик по кнопке — сброс к анимированному фону
    btn.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      try { localStorage.removeItem(STORAGE_BG); } catch (_) {}
      document.body.classList.add('bg-animated');
      // Очистим инлайны и вернёмся к CSS-переменной
      document.documentElement.style.removeProperty('background');
      document.body.style.removeProperty('animation');
      document.body.style.removeProperty('backgroundImage');
      document.body.style.removeProperty('background');
      document.documentElement.style.setProperty('--page-bg', '#ffffff');
    });
  });
}

/* ---------- Cart storage helpers ---------- */
const CART_KEY = "se_cart";
const DEFAULT_PRODUCTS = [
  { name: "Fresh Fruits", price: 3.50, qty: 1 },
  { name: "Organic Veggies", price: 2.20, qty: 1 },
  { name: "Dairy & Eggs", price: 2.80, qty: 1 },
  { name: "Bakery", price: 4.00, qty: 1 },
  { name: "Local Honey", price: 5.50, qty: 1 },
  { name: "Herbs", price: 1.90, qty: 1 },
  { name: "Nuts & Seeds", price: 3.20, qty: 1 },
  { name: "Juices", price: 2.50, qty: 1 },
  { name: "Pantry", price: 6.00, qty: 1 }
];

const getCart = () => JSON.parse(localStorage.getItem(CART_KEY) || '[]');
const saveCart = (cart) => localStorage.setItem(CART_KEY, JSON.stringify(cart));
const seedCartIfEmpty = () => { if (!getCart().length) saveCart(DEFAULT_PRODUCTS); };

function addToCart(item) {
  const cart = getCart();
  const i = cart.findIndex(p => p.name === item.name);
  if (i >= 0) cart[i].qty += item.qty; else cart.push(item);
  saveCart(cart);
}
function updateQty(name, delta) {
  const cart = getCart();
  const i = cart.findIndex(p => p.name === name);
  if (i >= 0) {
    cart[i].qty += delta;
    if (cart[i].qty <= 0) cart.splice(i, 1);
    saveCart(cart);
  }
}

/* ---------- Products: Add to Cart ---------- */
function initProductsAddToCart() {
  const buttons = document.querySelectorAll('.add-to-cart[data-name][data-price]');
  if (!buttons.length) return;
  buttons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const name = btn.dataset.name;
      const price = parseFloat(btn.dataset.price);
      addToCart({ name, price, qty: 1 });

      const toast = document.getElementById('addToast');
      if (toast) {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
        clearTimeout(toast._tm);
        toast._tm = setTimeout(() => {
          toast.style.opacity = '0';
          toast.style.transform = 'translateY(10px)';
        }, 1200);
      }
    });
  });
}

/* ---------- Cart: render & +/- ---------- */
function initCartPage() {
  const tbody = document.getElementById("cartBody");
  if (!tbody) return;
  seedCartIfEmpty();

  const subtotalEl = document.getElementById("subtotal");
  const money = v => `$${v.toFixed(2)}`;

  function render() {
    const cart = getCart();
    tbody.innerHTML = '';
    let subtotal = 0;

    cart.forEach(item => {
      const total = item.price * item.qty;
      subtotal += total;
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${item.name}</td>
        <td>
          <div class="btn-group btn-group-sm" role="group">
            <button class="btn btn-outline-secondary" data-action="dec" data-name="${item.name}">−</button>
            <button class="btn btn-outline-secondary" disabled>${item.qty}</button>
            <button class="btn btn-outline-secondary" data-action="inc" data-name="${item.name}">+</button>
          </div>
        </td>
        <td>${money(item.price)}</td>
        <td class="fw-semibold">${money(total)}</td>
      `;
      tbody.appendChild(tr);
    });

    subtotalEl.textContent = money(subtotal);
  }

  tbody.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    const { action, name } = btn.dataset;
    if (action === 'inc') updateQty(name, +1);
    if (action === 'dec') updateQty(name, -1);
    render();
  });

  render();
}

/* ---------- Task 1: Form Validation (для модалок на всех страницах) ---------- */
function initFormValidation() {
  const forms = document.querySelectorAll('form[data-validate="on"]');
  if (!forms.length) return;

  forms.forEach((form) => {
    const errorBox = form.querySelector('.form-errors');
    const setErrors = (errs) => {
      if (!errorBox) return;
      errorBox.innerHTML = errs.map(m => `<li>${m}</li>`).join('');
      errorBox.style.display = errs.length ? 'block' : 'none';
    };

    form.addEventListener('submit', (e) => {
      const errors = [];

      form.querySelectorAll('[required]').forEach(inp => {
        if (!inp.value.trim()) errors.push(`Поле "${inp.name || inp.id}" обязательно.`);
      });

      const email = form.querySelector('input[type="email"]');
      if (email && email.value) {
        const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
        if (!ok) errors.push('Введите корректный email.');
      }

      const pass = form.querySelector('input[name="password"]');
      const pass2 = form.querySelector('input[name="passwordConfirm"]');
      if (pass && pass.value.trim().length < 6) errors.push('Пароль должен быть не короче 6 символов.');
      if (pass && pass2 && pass.value !== pass2.value) errors.push('Пароли не совпадают.');

      if (errors.length) { e.preventDefault(); setErrors(errors); }
      else setErrors([]);
    });
  });
}