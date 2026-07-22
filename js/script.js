const productList = document.getElementById("product-list");
const searchInput = document.getElementById("searchInput");
const categoryBar = document.getElementById("categoryBar");
const companyBar = document.getElementById("companyBar");
const loading = document.getElementById("loading");

const API_URL = "https://script.google.com/macros/s/AKfycbw4f8BkzgOt9pn6vBlupQxGQWNrtlEEYDB0PnZOxi0GXuuivBL9cTCUk5PCqxAnUGS0/exec";
const WHATSAPP_NUMBER = "918349217679";

let products = [];
let activeCategory = "All";
let activeCompany = "All";

async function loadProducts() {
  loading.style.display = "flex";
  productList.style.display = "none";
  
  try {
    const response = await fetch(API_URL);
    products = await response.json();
    renderCategoryButtons();
    renderCompanyButtons();
    displayProducts(products);
    loading.style.display = "none";
    productList.style.display = "grid";
  } catch (error) {
    loading.style.display = "none";
    productList.style.display = "grid";
    productList.innerHTML = "<p>Could not load products. Check your connection.</p>";
    console.error(error);
  }
}

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

function displayProducts(list) {
  productList.innerHTML = "";

  list.forEach(product => {
    let imageUrl = "https://placehold.co/250x180?text=No+Image";

    if (product["Image URL"] && product["Image URL"].trim() !== "") {
      imageUrl = product["Image URL"];
    }

    const productName = product["Product Name"] || "this product";
    const message = encodeURIComponent(`Hi, I'm interested in ${productName}. Please share more details.`);
    const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;

    productList.innerHTML += `
      <div class="card">
        <a href="product.html?id=${product["Product ID"]}">
          <img src="${imageUrl}" alt="${product["Product Name"] || "Product"}">
          <h3>${product["Product Name"] || ""}</h3>
        </a>
        <p><b>Company:</b> ${product["Company"] || ""}</p>
        <p><b>Category:</b> ${product["Category"] || ""}</p>
        <p><b>MRP:</b> ₹${product["MRP"] || ""}</p>
        <a href="${whatsappLink}" target="_blank" class="whatsapp-btn">Enquire on WhatsApp</a>
      </div>`;
  });
}

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

loadProducts();
