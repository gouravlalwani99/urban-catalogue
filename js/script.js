/* ==========================================================================
   Urban Distributor — Main Catalogue Script
   ==========================================================================
   ⚠ Google Sheets fetch logic, filter logic, and data-mapping are PRESERVED.
   Only the UI shell (card template, skeleton, header, footer) are enhanced.
   ========================================================================== */

const productList = document.getElementById("product-list");
const searchInput = document.getElementById("searchInput");
const categoryBar = document.getElementById("categoryBar");
const companyBar = document.getElementById("companyBar");
const loading = document.getElementById("loading");
const skeletonLoader = document.getElementById("skeletonLoader");

const API_URL = "https://script.google.com/macros/s/AKfycbw4f8BkzgOt9pn6vBlupQxGQWNrtlEEYDB0PnZOxi0GXuuivBL9cTCUk5PCqxAnUGS0/exec";
const WHATSAPP_NUMBER = "918349217679";

let products = [];
let activeCategory = "All";
let activeCompany = "All";


/* ---------- WhatsApp SVG icon (reused in cards) ---------- */
const WHATSAPP_ICON = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`;


/* ==========================================================================
   DATA LOADING (UNTOUCHED FETCH LOGIC)
   ========================================================================== */
async function loadProducts() {
  // Show skeleton, hide product list
  if (skeletonLoader) skeletonLoader.style.display = "grid";
  productList.style.display = "none";
  loading.style.display = "none";

  try {
    const response = await fetch(API_URL);
    products = await response.json();
    renderCategoryButtons();
    renderCompanyButtons();
    displayProducts(products);

    // Hide skeleton, show grid
    if (skeletonLoader) skeletonLoader.style.display = "none";
    productList.style.display = "grid";
  } catch (error) {
    if (skeletonLoader) skeletonLoader.style.display = "none";
    productList.style.display = "grid";
    productList.innerHTML = `
      <div class="error-state">
        <p>Could not load products. Please check your connection and try again.</p>
      </div>`;
    console.error(error);
  }
}


/* ==========================================================================
   FILTER BUTTONS (UNTOUCHED LOGIC)
   ========================================================================== */
function renderCategoryButtons() {
  const categories = ["All", ...new Set(products.map(p => p["Category"]).filter(c => c && c.trim() !== ""))];

  categoryBar.innerHTML = "";

  categories.forEach(category => {
    const btn = document.createElement("button");
    btn.textContent = category;
    btn.className = "category-btn" + (category === activeCategory ? " active" : "");

    btn.addEventListener("click", () => {
      activeCategory = category;
      activeCompany = "All";
      applyFilters();
      renderCategoryButtons();
      renderCompanyButtons();
    });

    categoryBar.appendChild(btn);
  });
}

function renderCompanyButtons() {
  let filteredProducts = products;

  if (activeCategory !== "All") {
    filteredProducts = products.filter(product => product["Category"] === activeCategory);
  }

  const companies = ["All", ...new Set(filteredProducts.map(p => p["Company"]).filter(c => c && c.trim() !== ""))];

  companyBar.innerHTML = "";

  companies.forEach(company => {
    const btn = document.createElement("button");
    btn.textContent = company;
    btn.className = "category-btn" + (company === activeCompany ? " active" : "");

    btn.addEventListener("click", () => {
      activeCompany = company;
      applyFilters();
      renderCompanyButtons();
    });

    companyBar.appendChild(btn);
  });
}


/* ==========================================================================
   DISPLAY PRODUCTS (Enhanced card template — data mapping UNTOUCHED)
   ========================================================================== */
function displayProducts(list) {
  productList.innerHTML = "";

  if (list.length === 0) {
    productList.innerHTML = `
      <div class="empty-state">
        <svg class="empty-state__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          <line x1="8" y1="11" x2="14" y2="11"></line>
        </svg>
        <h3 class="empty-state__title">No products found</h3>
        <p class="empty-state__text">Try adjusting your search or filter to find what you're looking for.</p>
      </div>`;
    return;
  }

  list.forEach(product => {
    let imageUrl = "https://placehold.co/400x300/F7F7F8/D1D1D6?text=No+Image";

    if (product["Image URL"] && product["Image URL"].trim() !== "") {
      imageUrl = product["Image URL"];
    }

    const productName = product["Product Name"] || "this product";
    const message = encodeURIComponent(`Hi, I'm interested in ${productName}. Please share more details.`);
    const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;

    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <a href="product.html?id=${product["Product ID"]}" class="card__image-wrap">
        <img src="${imageUrl}" alt="${product["Product Name"] || "Product"}" loading="lazy">
        ${product["Category"] ? `<span class="card__badge">${product["Category"]}</span>` : ""}
      </a>
      <div class="card__body">
        <h3 class="card__name">
          <a href="product.html?id=${product["Product ID"]}">${product["Product Name"] || ""}</a>
        </h3>
        <p class="card__company">${product["Company"] || ""}</p>
        <p class="card__price"><span>MRP </span>₹${product["MRP"] || "N/A"}</p>
        <a href="${whatsappLink}" target="_blank" rel="noopener noreferrer" class="whatsapp-btn">
          ${WHATSAPP_ICON}
          Enquire on WhatsApp
        </a>
      </div>`;

    productList.appendChild(card);
  });
}


/* ==========================================================================
   FILTER LOGIC (UNTOUCHED)
   ========================================================================== */
function applyFilters() {
  const value = searchInput.value.toLowerCase();

  let filtered = products;

  if (activeCategory !== "All") {
    filtered = filtered.filter(product => product["Category"] === activeCategory);
  }

  if (activeCompany !== "All") {
    filtered = filtered.filter(product => product["Company"] === activeCompany);
  }

  if (value.trim() !== "") {
    filtered = filtered.filter(product =>
      (product["Product Name"] || "").toLowerCase().includes(value) ||
      (product["Company"] || "").toLowerCase().includes(value) ||
      (product["Category"] || "").toLowerCase().includes(value) ||
      (product["Search Keywords"] || "").toLowerCase().includes(value)
    );
  }

  displayProducts(filtered);
}

searchInput.addEventListener("keyup", applyFilters);


/* ==========================================================================
   UI ENHANCEMENTS (NEW — does not touch data layer)
   ========================================================================== */

/* --- Sticky header scroll shadow --- */
const header = document.getElementById("header");
if (header) {
  window.addEventListener("scroll", () => {
    header.classList.toggle("header--scrolled", window.scrollY > 10);
  }, { passive: true });
}

/* --- Hamburger menu --- */
const hamburgerBtn = document.getElementById("hamburgerBtn");
const mainNav = document.getElementById("mainNav");
const navOverlay = document.getElementById("navOverlay");

function toggleNav() {
  const isOpen = mainNav.classList.toggle("nav--open");
  hamburgerBtn.classList.toggle("active", isOpen);
  navOverlay.classList.toggle("active", isOpen);
  document.body.style.overflow = isOpen ? "hidden" : "";
}

if (hamburgerBtn) {
  hamburgerBtn.addEventListener("click", toggleNav);
}
if (navOverlay) {
  navOverlay.addEventListener("click", toggleNav);
}

/* --- Footer copyright year --- */
const footerYear = document.getElementById("footerYear");
if (footerYear) {
  footerYear.textContent = new Date().getFullYear();
}


/* ==========================================================================
   INIT
   ========================================================================== */
loadProducts();
