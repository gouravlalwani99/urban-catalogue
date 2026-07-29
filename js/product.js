/* ==========================================================================
   Urban Distributor — Product Detail Script
   ==========================================================================
   ⚠ Google Sheets fetch logic and data-mapping are PRESERVED.
   Only the UI shell (detail template, skeleton, header, footer) are enhanced.
   ========================================================================== */

const API_URL = "https://script.google.com/macros/s/AKfycbyFDX-Sld5uXa3go-xFaA_wVV9N39pKp2VIZ-8ZkeO1HBjl4d3WSOA34MDmLsOMuLHq/exec";
const WHATSAPP_NUMBER = "918349217679";

const detailContainer = document.getElementById("product-detail");
const loading = document.getElementById("loading");
const skeletonLoader = document.getElementById("skeletonLoader");

const WHATSAPP_ICON = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`;


/* ==========================================================================
   DATA LOADING (UNTOUCHED FETCH LOGIC)
   ========================================================================== */
function getProductIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

async function loadProductDetail() {
  const productId = getProductIdFromURL();

  // Show skeleton, hide detail
  if (skeletonLoader) skeletonLoader.style.display = "block";
  detailContainer.style.display = "none";
  loading.style.display = "none";

  try {
    const response = await fetch(API_URL);
    const products = await response.json();

    const product = products.find(p => String(p["Product ID"]) === String(productId));

    if (!product) {
      if (skeletonLoader) skeletonLoader.style.display = "none";
      detailContainer.style.display = "block";
      detailContainer.innerHTML = `
        <div class="detail-card">
          <div class="detail-card__body">
            <div class="empty-state" style="padding: var(--sp-10) 0;">
              <h3 class="empty-state__title">Product not found</h3>
              <p class="empty-state__text">The product you're looking for doesn't exist or has been removed.</p>
              <a href="index.html" class="btn-back" style="margin-top: var(--sp-6); display: inline-flex;">← Back to all products</a>
            </div>
          </div>
        </div>`;
      return;
    }

    let imageUrl = "https://placehold.co/600x400/F7F7F8/D1D1D6?text=No+Image";
    if (product["Image URL"] && product["Image URL"].trim() !== "") {
      imageUrl = product["Image URL"];
    }

    const message = encodeURIComponent(`Hi, I'm interested in ${product["Product Name"]}. Please share more details.`);
    const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;

    // Build meta items, only showing fields that have values
    const metaFields = [
      { label: "Company", value: product["Company"] },
      { label: "Brand", value: product["Brand"] },
      { label: "Category", value: product["Category"] },
      { label: "Sub Category", value: product["Sub Category"] },
      { label: "Size", value: product["Size"] },
      { label: "Pack Size", value: product["Pack Size"] },
      { label: "UOM", value: product["UOM"] },
      { label: "Product Code", value: product["Product Code"] },
    ];

    const metaHTML = metaFields
      .filter(f => f.value && f.value.trim() !== "")
      .map(f => `
        <div class="detail-card__meta-item">
          <span class="detail-card__meta-label">${f.label}</span>
          <span class="detail-card__meta-value">${f.value}</span>
        </div>`)
      .join("");

    const descriptionHTML = product["Description"] && product["Description"].trim() !== ""
      ? `<p class="detail-card__description">${product["Description"]}</p>`
      : "";

    detailContainer.innerHTML = `
      <div class="detail-card">
        <div class="detail-card__image-wrap">
          <img src="${imageUrl}" alt="${product["Product Name"]}" loading="lazy">
        </div>
        <div class="detail-card__body">
          <h2 class="detail-card__title">${product["Product Name"] || ""}</h2>
          <div class="detail-card__meta">
            ${metaHTML}
          </div>
          <p class="detail-card__price"><span>MRP </span>₹${product["MRP"] || "N/A"}</p>
          ${descriptionHTML}
          <div class="detail-card__actions">
            <a href="${whatsappLink}" target="_blank" rel="noopener noreferrer" class="whatsapp-btn">
              ${WHATSAPP_ICON}
              Enquire on WhatsApp
            </a>
            <a href="index.html" class="btn-back">← Back to all products</a>
          </div>
        </div>
      </div>`;

    // Hide skeleton, show detail
    if (skeletonLoader) skeletonLoader.style.display = "none";
    detailContainer.style.display = "block";

    // Update page title with product name
    if (product["Product Name"]) {
      document.title = `${product["Product Name"]} — Urban Distributor`;
    }

  } catch (error) {
    if (skeletonLoader) skeletonLoader.style.display = "none";
    detailContainer.style.display = "block";
    detailContainer.innerHTML = `
      <div class="error-state">
        <p>Could not load product details. Please check your connection and try again.</p>
        <a href="index.html" class="btn-back" style="margin-top: var(--sp-6); display: inline-flex;">← Back to all products</a>
      </div>`;
    console.error(error);
  }
}


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
loadProductDetail();
