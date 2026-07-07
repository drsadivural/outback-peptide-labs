/* =========================================================
   Outback Peptide Labs — storefront catalogue
   Edit PRODUCTS to manage the shop: name, category, desc,
   badge, optional image, optionLabel, and variants
   (size + price in AUD). Prices set 6 Jul 2026 to the
   cheapest of Outback vs aussiepeptides.au per the
   "Best Price List" workbook.
   ========================================================= */

const PRODUCTS = [
  /* ---------- Tissue Repair & Regenerative Support ---------- */
  {
    id: "bpc-157",
    name: "BPC-157",
    category: "Tissue Repair & Regenerative Support",
    desc: "A synthetic peptide fragment that is the subject of ongoing preclinical research into tissue-repair and gastrointestinal models.",
    badge: "Popular",
    color: "#a84e1c",
    variants: [
      { dose: "5mg", price: 59.95 },
      { dose: "10mg", price: 94.99 },
    ],
  },
  {
    id: "tb-500",
    name: "TB-500",
    category: "Tissue Repair & Regenerative Support",
    desc: "A synthetic version of thymosin beta-4, studied in research into cellular-repair and recovery models.",
    badge: null,
    color: "#b8632a",
    variants: [{ dose: "10mg", price: 129.99 }],
  },
  {
    id: "bpc-tb",
    name: "BPC-157 + TB-500",
    category: "Tissue Repair & Regenerative Support",
    desc: "A combination of BPC-157 and TB-500 supplied together in a single vial for tissue-repair research applications.",
    badge: "Stack",
    color: "#8a5a33",
    variants: [{ dose: "10mg", price: 109.99 }],
  },
  {
    id: "kpv",
    name: "KPV",
    category: "Tissue Repair & Regenerative Support",
    desc: "A tripeptide fragment (lysine-proline-valine) studied in research into inflammatory-response models.",
    badge: null,
    color: "#c2601f",
    variants: [{ dose: "10mg", price: 89.99 }],
  },
  {
    id: "ghk-cu",
    name: "Copper Peptide (GHK-Cu)",
    category: "Tissue Repair & Regenerative Support",
    desc: "A naturally occurring copper-binding peptide investigated in research into skin, collagen and wound-healing models.",
    badge: null,
    color: "#b87333",
    variants: [
      { dose: "50mg", price: 69.95 },
      { dose: "100mg", price: 109.95 },
    ],
  },
  {
    id: "glow",
    name: "GLOW Peptide Blend",
    category: "Tissue Repair & Regenerative Support",
    desc: "A multi-peptide research blend combining BPC-157, TB-500 and GHK-Cu in a single vial for tissue-repair research.",
    badge: "Blend",
    color: "#d98841",
    variants: [
      { dose: "50mg", price: 168.99 },
      { dose: "70mg", price: 199.99 },
    ],
  },
  {
    id: "klow",
    name: "Klow (Multi-Peptide Stack)",
    category: "Tissue Repair & Regenerative Support",
    desc: "An advanced, proprietary multi-peptide stack combining four synthetic peptides — BPC-157, GHK-Cu, TB-500 and KPV — in a single formulation for research applications.",
    badge: "Premium Stack",
    color: "#c2601f",
    variants: [
      { dose: "Blend 78mg", price: 189.95 },
      { dose: "Blend 130mg", price: 289.95 },
    ],
  },

  /* ---------- Hormonal Balance & Metabolic Regulation ---------- */
  {
    id: "retatrutide",
    name: "Retatrutide",
    category: "Hormonal Balance & Metabolic Regulation",
    desc: "A multi-receptor agonist peptide investigated in metabolic research, including laboratory studies of energy balance and body-weight regulation.",
    badge: "Best Seller",
    color: "#14b8a0",
    image: "images/retatrutide.avif",
    variants: [
      { dose: "10mg", price: 144.99 },
      { dose: "15mg", price: 179.99 },
      { dose: "20mg", price: 229.99 },
      { dose: "30mg", price: 329.99 },
      { dose: "40mg", price: 429.95 },
      { dose: "60mg", price: 549.99 },
    ],
  },
  {
    id: "tirzepatide",
    name: "Tirzepatide",
    category: "Hormonal Balance & Metabolic Regulation",
    desc: "A dual GIP and GLP-1 receptor agonist peptide investigated in metabolic research, including laboratory studies of glucose regulation and energy balance.",
    badge: "Popular",
    color: "#8a5a33",
    variants: [
      { dose: "10mg", price: 139.95 },
      { dose: "20mg", price: 249.99 },
      { dose: "30mg", price: 319.95 },
      { dose: "40mg", price: 343.99 },
      { dose: "60mg", price: 423.99 },
    ],
  },
  {
    id: "cjc-ipamorelin",
    name: "CJC-1295 + Ipamorelin",
    category: "Hormonal Balance & Metabolic Regulation",
    desc: "A peptide combination studied in research contexts for its effects on growth-hormone secretion pathways.",
    badge: "Stack",
    color: "#9c6b3f",
    variants: [
      { dose: "5mg + 5mg", price: 119.95 },
      { dose: "10mg + 10mg", price: 199.95 },
    ],
  },
  {
    id: "cjc-no-dac",
    name: "CJC-1295 (no DAC)",
    category: "Hormonal Balance & Metabolic Regulation",
    desc: "A growth-hormone-releasing peptide analogue studied in research into GH-secretion pathways.",
    badge: null,
    color: "#6b4226",
    variants: [{ dose: "10mg", price: 104.99 }],
  },
  {
    id: "cjc-dac",
    name: "CJC-1295 with DAC",
    category: "Hormonal Balance & Metabolic Regulation",
    desc: "A long-acting growth-hormone-releasing peptide analogue studied in GH-axis research.",
    badge: null,
    color: "#7a5333",
    variants: [{ dose: "10mg", price: 179.99 }],
  },
  {
    id: "ipamorelin",
    name: "Ipamorelin",
    category: "Hormonal Balance & Metabolic Regulation",
    desc: "A selective growth-hormone secretagogue studied in research into GH-release pathways.",
    badge: null,
    color: "#a06a3a",
    variants: [{ dose: "10mg", price: 89.99 }],
  },
  {
    id: "tesamorelin",
    name: "Tesamorelin",
    category: "Hormonal Balance & Metabolic Regulation",
    desc: "A stabilised GHRH analogue investigated in metabolic and body-composition research.",
    badge: null,
    color: "#8a5a33",
    variants: [
      { dose: "5mg", price: 79.99 },
      { dose: "10mg", price: 145.99 },
      { dose: "20mg", price: 259.99 },
    ],
  },
  {
    id: "aod-9604",
    name: "AOD-9604",
    category: "Hormonal Balance & Metabolic Regulation",
    desc: "A modified fragment of the growth-hormone molecule studied in metabolic research models.",
    badge: null,
    color: "#c2601f",
    variants: [{ dose: "5mg", price: 99.99 }],
  },
  {
    id: "cagrilintide",
    name: "Cagrilintide",
    category: "Hormonal Balance & Metabolic Regulation",
    desc: "A long-acting amylin analogue investigated in metabolic and appetite-regulation research.",
    badge: null,
    color: "#b87333",
    variants: [{ dose: "5mg", price: 129.99 }],
  },
  {
    id: "amino-1mq",
    name: "5-Amino-1MQ",
    category: "Hormonal Balance & Metabolic Regulation",
    desc: "A small-molecule research compound studied in metabolic and NNMT-pathway research.",
    badge: null,
    color: "#9c6b3f",
    variants: [{ dose: "50mg", price: 109.99 }],
  },
  {
    id: "slu-pp-332",
    name: "SLU-PP-332",
    category: "Hormonal Balance & Metabolic Regulation",
    desc: "A research compound studied in metabolic and mitochondrial-activity models.",
    badge: null,
    color: "#a84e1c",
    variants: [{ dose: "5mg", price: 105.99 }],
  },

  /* ---------- Resilience & Healthy Aging ---------- */
  {
    id: "mots-c",
    name: "MOTS-c",
    category: "Resilience & Healthy Aging",
    desc: "A mitochondrial-derived peptide studied in research into cellular energy metabolism and insulin-sensitivity pathways, of interest in metabolic and ageing research.",
    badge: "New",
    color: "#5a7d5a",
    variants: [
      { dose: "5mg", price: 89.95 },
      { dose: "10mg", price: 94.99 },
      { dose: "20mg", price: 125.99 },
      { dose: "40mg", price: 159.99 },
    ],
  },
  {
    id: "nad",
    name: "NAD+",
    category: "Resilience & Healthy Aging",
    desc: "A cellular coenzyme supplied for research into energy-metabolism and cellular-ageing models.",
    badge: null,
    color: "#6b8a5a",
    variants: [{ dose: "500mg", price: 129.99 }],
  },
  {
    id: "ss-31",
    name: "SS-31",
    category: "Resilience & Healthy Aging",
    desc: "A mitochondria-targeted research peptide studied in cellular-energy and oxidative-stress models.",
    badge: null,
    color: "#4f7a6a",
    variants: [{ dose: "10mg", price: 89.99 }],
  },
  {
    id: "epitalon",
    name: "Epitalon",
    category: "Resilience & Healthy Aging",
    desc: "A synthetic tetrapeptide studied in research into telomere and cellular-ageing pathways.",
    badge: null,
    color: "#5a7d5a",
    variants: [{ dose: "10mg", price: 79.99 }],
  },
  {
    id: "glutathione",
    name: "Glutathione",
    category: "Resilience & Healthy Aging",
    desc: "An antioxidant tripeptide supplied for research into oxidative-stress and cellular models.",
    badge: null,
    color: "#7a9060",
    variants: [{ dose: "600mg", price: 79.99 }],
  },
  {
    id: "ara-290",
    name: "ARA-290 (Cibinetide)",
    category: "Resilience & Healthy Aging",
    desc: "A synthetic peptide studied in research into tissue-protection and neuropathy models.",
    badge: null,
    color: "#6b8a5a",
    variants: [{ dose: "10mg", price: 89.99 }],
  },

  /* ---------- Neuro-Enhancement & Specialty Protocols ---------- */
  {
    id: "selank",
    name: "Selank",
    category: "Neuro-Enhancement & Specialty Protocols",
    desc: "A synthetic analogue of the peptide tuftsin, studied in neuroscience research into stress-response and cognition pathways.",
    badge: null,
    color: "#5a7d5a",
    variants: [
      { dose: "5mg", price: 64.95 },
      { dose: "10mg", price: 94.99 },
    ],
  },
  {
    id: "semax",
    name: "Semax",
    category: "Neuro-Enhancement & Specialty Protocols",
    desc: "A synthetic peptide studied in neuroscience research into cognitive-function and neuroprotection pathways.",
    badge: null,
    color: "#7a5f2a",
    variants: [
      { dose: "5mg", price: 69.95 },
      { dose: "10mg", price: 69.99 },
      { dose: "30mg", price: 269.95 },
    ],
  },
  {
    id: "dsip",
    name: "DSIP",
    category: "Neuro-Enhancement & Specialty Protocols",
    desc: "A delta sleep-inducing peptide studied in research into sleep-regulation and stress models.",
    badge: null,
    color: "#6b5a44",
    variants: [{ dose: "10mg", price: 75.99 }],
  },
  {
    id: "pt-141",
    name: "PT-141",
    category: "Neuro-Enhancement & Specialty Protocols",
    desc: "A melanocortin-receptor peptide studied in neuroscience and receptor-pathway research.",
    badge: null,
    color: "#a84e1c",
    variants: [{ dose: "10mg", price: 99.99 }],
  },
  {
    id: "melanotan-1",
    name: "Melanotan I",
    category: "Neuro-Enhancement & Specialty Protocols",
    desc: "A synthetic analogue of alpha-MSH studied in research into melanogenesis (pigmentation) pathways.",
    badge: null,
    color: "#b87333",
    variants: [{ dose: "10mg", price: 79.99 }],
  },
  {
    id: "melanotan-2",
    name: "Melanotan II",
    category: "Neuro-Enhancement & Specialty Protocols",
    desc: "A synthetic melanocortin analogue studied in research into pigmentation and receptor pathways.",
    badge: null,
    color: "#c2601f",
    variants: [{ dose: "10mg", price: 79.99 }],
  },

  /* ---------- Lab Supplies ---------- */
  {
    id: "bac-water",
    name: "Bacteriostatic Water",
    category: "Lab Supplies",
    desc: "Bacteriostatic water for laboratory reconstitution of lyophilised research peptides. Contains 0.9% benzyl alcohol. Not for injection.",
    badge: null,
    color: "#7a8a9a",
    optionLabel: "Size",
    noCoa: true,
    variants: [
      { dose: "3mL", price: 19.99 },
      { dose: "10mL", price: 28.99 },
    ],
  },
  {
    id: "syringes",
    name: "Insulin Syringes",
    category: "Lab Supplies",
    desc: "Sterile single-use syringes for laboratory handling and measurement of reconstituted research material.",
    badge: null,
    color: "#8a9aa5",
    optionLabel: "Pack",
    noCoa: true,
    variants: [{ dose: "20 pack", price: 22.99 }],
  },
];

/* =========================================================
   BULK KITS — bundled multi-vial kits at volume pricing.
   `optionLabel` renames the selector; `noCoa` hides the
   lab-report link (e.g. for supplies kits).
   ========================================================= */
const KITS = [
  {
    id: "kit-recovery",
    name: "Recovery & Repair Kit",
    desc: "A bundled research kit pairing BPC-157, TB-500 and GHK-Cu, supplied together at bulk pricing for tissue-repair research programs.",
    badge: "Best Value",
    color: "#a84e1c",
    optionLabel: "Kit Size",
    variants: [
      { dose: "Standard — 3 vials", price: 249.95 },
      { dose: "Bulk — 6 vials", price: 459.95 },
      { dose: "Lab — 12 vials", price: 839.95 },
    ],
  },
  {
    id: "kit-metabolic",
    name: "Metabolic Research Kit",
    desc: "A bundled kit combining Retatrutide and Tirzepatide for laboratories running metabolic research at volume.",
    badge: "Popular",
    color: "#8a5a33",
    optionLabel: "Kit Size",
    variants: [
      { dose: "Standard — 2 vials", price: 269.95 },
      { dose: "Bulk — 6 vials", price: 749.95 },
    ],
  },
  {
    id: "kit-cognition",
    name: "Cognition Research Kit",
    desc: "A bundled kit pairing Selank and Semax for neuroscience research applications, priced for volume.",
    badge: null,
    color: "#5a7d5a",
    optionLabel: "Kit Size",
    variants: [
      { dose: "Standard — 2 vials", price: 129.95 },
      { dose: "Bulk — 6 vials", price: 349.95 },
    ],
  },
  {
    id: "kit-supplies",
    name: "Reconstitution Supplies Kit",
    desc: "Laboratory reconstitution supplies — bacteriostatic water, sterile syringes and alcohol swabs — bundled for research handling. Contains no peptides.",
    badge: "Supplies",
    color: "#6b4226",
    optionLabel: "Pack Size",
    noCoa: true,
    variants: [
      { dose: "Starter — 10 sets", price: 39.95 },
      { dose: "Bulk — 25 sets", price: 84.95 },
    ],
  },
];

const AUD = new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD" });

/* =========================================================
   AGE GATE (18+)
   ========================================================= */
const AGE_KEY = "apl_age_verified";
const gate = document.getElementById("ageGate");
const gateCard = document.getElementById("ageGateCard");

function initAgeGate() {
  if (localStorage.getItem(AGE_KEY) === "true") {
    document.body.classList.remove("gate-locked");
    return;
  }
  document.getElementById("gateEnterBtn").addEventListener("click", () => {
    localStorage.setItem(AGE_KEY, "true");
    document.body.classList.remove("gate-locked");
  });
  document.getElementById("gateExitBtn").addEventListener("click", denyAccess);
}

function denyAccess() {
  localStorage.removeItem(AGE_KEY);
  gateCard.classList.add("age-gate__denied");
  gateCard.innerHTML = `
    <img src="images/logo-badge.png" alt="Outback Peptide Labs" class="age-gate__badge" />
    <div class="age-gate__logo">Outback <span>Peptide Labs</span></div>
    <h1>Access Denied</h1>
    <p class="age-gate__lead">
      You must be 18 years of age or older to access this website.<br />
      You are being redirected away from this site.
    </p>`;
  setTimeout(() => {
    window.location.replace("https://www.google.com.au");
  }, 2500);
}

/* =========================================================
   PRODUCT GRID + DOSAGE SELECTION
   ========================================================= */
function vialSVG(color, size) {
  const h = size || 140;
  return `
  <svg viewBox="0 0 120 150" height="${h}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect x="40" y="6" width="40" height="16" rx="4" fill="#c9a44a"/>
    <rect x="45" y="22" width="30" height="9" fill="#9fb3c8" opacity=".6"/>
    <path d="M36 31 h48 v88 a24 24 0 0 1 -24 24 a24 24 0 0 1 -24 -24 Z"
          fill="#ffffff" opacity=".5" stroke="#9fb3c8" stroke-width="2.5"/>
    <path d="M40 78 h40 v40 a20 20 0 0 1 -20 20 a20 20 0 0 1 -20 -20 Z" fill="${color}" opacity=".85"/>
    <rect x="44" y="56" width="32" height="34" rx="3" fill="#fff" opacity=".95"/>
    <rect x="48" y="61" width="24" height="4" rx="2" fill="#12263a"/>
    <rect x="48" y="69" width="16" height="3.4" rx="1.7" fill="#5b7a99"/>
    <rect x="48" y="76" width="20" height="3.4" rx="1.7" fill="#5b7a99"/>
  </svg>`;
}

function productMedia(p, size) {
  return p.image
    ? `<img src="${p.image}" alt="${p.name} vial" class="product-card__img" />`
    : vialSVG(p.color, size);
}

function itemById(id) {
  return PRODUCTS.concat(KITS).find((x) => x.id === id);
}

function renderGrid(items, gridId) {
  const grid = document.getElementById(gridId);
  if (!grid) return;
  grid.innerHTML = items
    .map((p) => {
      const options = p.variants
        .map((v, i) => `<option value="${i}">${v.dose} — ${AUD.format(v.price)}</option>`)
        .join("");
      const optionLabel = p.optionLabel || "Dosage";
      const coa = p.noCoa
        ? ""
        : `<a href="#" class="coa-link" onclick="event.preventDefault()">Lab Report ↗</a>`;
      return `
    <article class="product-card" data-id="${p.id}">
      <div class="product-card__media">
        ${p.badge ? `<span class="badge">${p.badge}</span>` : ""}
        <span class="badge badge--stock">In Stock</span>
        ${productMedia(p)}
      </div>
      <div class="product-card__body">
        <h3 class="product-card__name">${p.name}</h3>
        <p class="product-card__desc">${p.desc}</p>
        <div class="dose-row">
          <label for="dose-${p.id}">${optionLabel}</label>
          <select class="dose-select" id="dose-${p.id}" data-id="${p.id}">${options}</select>
        </div>
        <div class="product-card__foot">
          <div class="price" id="price-${p.id}">
            ${AUD.format(p.variants[0].price)}
            <small>AUD inc. GST</small>
          </div>
          ${coa}
        </div>
        <button class="btn btn--primary btn--block add-btn" data-id="${p.id}">Add to Cart</button>
      </div>
    </article>`;
    })
    .join("");
}

function initGridEvents(gridId) {
  const grid = document.getElementById(gridId);
  if (!grid) return;

  grid.addEventListener("change", (e) => {
    if (!e.target.classList.contains("dose-select")) return;
    const p = itemById(e.target.dataset.id);
    const v = p.variants[Number(e.target.value)];
    document.getElementById(`price-${p.id}`).innerHTML =
      `${AUD.format(v.price)}<small>AUD inc. GST</small>`;
  });

  grid.addEventListener("click", (e) => {
    const btn = e.target.closest(".add-btn");
    if (!btn) return;
    const p = itemById(btn.dataset.id);
    const sel = document.getElementById(`dose-${p.id}`);
    addToCart(p, p.variants[Number(sel.value)]);
  });
}

/* =========================================================
   CATEGORY FILTER TABS
   ========================================================= */
function initCategoryTabs() {
  const wrap = document.getElementById("catTabs");
  if (!wrap) return;
  const cats = ["All Peptides", ...new Set(PRODUCTS.map((p) => p.category).filter(Boolean))];
  wrap.innerHTML = cats
    .map((c, i) => `<button class="cat-tab${i === 0 ? " active" : ""}" data-cat="${c}">${c}</button>`)
    .join("");
  wrap.addEventListener("click", (e) => {
    const btn = e.target.closest(".cat-tab");
    if (!btn) return;
    wrap.querySelectorAll(".cat-tab").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const cat = btn.dataset.cat;
    const items = cat === "All Peptides" ? PRODUCTS : PRODUCTS.filter((p) => p.category === cat);
    renderGrid(items, "productGrid");
  });
}

/* =========================================================
   CART
   ========================================================= */
const CART_KEY = "apl_cart";
let cart = [];

function loadCart() {
  try {
    cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    cart = [];
  }
}
function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addToCart(product, variant) {
  const key = `${product.id}|${variant.dose}`;
  const existing = cart.find((i) => i.key === key);
  if (existing) existing.qty += 1;
  else cart.push({ key, id: product.id, name: product.name, dose: variant.dose, variantLabel: product.optionLabel || "Dosage", price: variant.price, color: product.color, image: product.image || null, qty: 1 });
  saveCart();
  renderCart();
  showToast(`Added ${product.name} (${variant.dose}) to cart`);
}

function changeQty(key, delta) {
  const item = cart.find((i) => i.key === key);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter((i) => i.key !== key);
  saveCart();
  renderCart();
}

function removeItem(key) {
  cart = cart.filter((i) => i.key !== key);
  saveCart();
  renderCart();
}

function renderCart() {
  const wrap = document.getElementById("cartItems");
  const count = cart.reduce((n, i) => n + i.qty, 0);
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

  document.getElementById("cartCount").textContent = count;
  document.getElementById("cartSubtotal").textContent = AUD.format(subtotal);

  if (cart.length === 0) {
    wrap.innerHTML = `<p class="cart-empty">Your cart is empty.</p>`;
    return;
  }
  wrap.innerHTML = cart
    .map(
      (i) => `
    <div class="cart-item">
      <div class="cart-item__thumb">${i.image ? `<img src="${i.image}" alt="" />` : vialSVG(i.color, 40)}</div>
      <div class="cart-item__info">
        <div class="cart-item__name">${i.name}</div>
        <div class="cart-item__variant">${i.variantLabel || "Dosage"}: ${i.dose}</div>
        <div class="cart-item__row">
          <span class="qty">
            <button data-act="dec" data-key="${i.key}" aria-label="Decrease quantity">−</button>
            <span>${i.qty}</span>
            <button data-act="inc" data-key="${i.key}" aria-label="Increase quantity">+</button>
          </span>
          <span class="cart-item__price">${AUD.format(i.price * i.qty)}</span>
        </div>
        <button class="cart-item__remove" data-act="rm" data-key="${i.key}">Remove</button>
      </div>
    </div>`
    )
    .join("");
}

function initCartUI() {
  const open = () => document.body.classList.add("cart-open");
  const close = () => document.body.classList.remove("cart-open");
  document.getElementById("cartOpenBtn").addEventListener("click", open);
  document.getElementById("cartCloseBtn").addEventListener("click", close);
  document.getElementById("cartOverlay").addEventListener("click", close);

  document.getElementById("cartItems").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-act]");
    if (!btn) return;
    const { act, key } = btn.dataset;
    if (act === "inc") changeQty(key, 1);
    if (act === "dec") changeQty(key, -1);
    if (act === "rm") removeItem(key);
  });

  document.getElementById("checkoutBtn").addEventListener("click", () => {
    showToast("Demo site — checkout is not connected yet.");
  });
}

/* =========================================================
   MISC UI
   ========================================================= */
let toastTimer;
function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
}

function initNav() {
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("mainNav");
  toggle.addEventListener("click", () => nav.classList.toggle("open"));
  nav.addEventListener("click", (e) => {
    if (e.target.tagName === "A") nav.classList.remove("open");
  });
}

/* =========================================================
   BOOT
   ========================================================= */
initAgeGate();
renderGrid(PRODUCTS, "productGrid");
renderGrid(KITS, "kitGrid");
initGridEvents("productGrid");
initGridEvents("kitGrid");
initCategoryTabs();
loadCart();
renderCart();
initCartUI();
initNav();
