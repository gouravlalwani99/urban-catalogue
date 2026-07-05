const API_URL = "https://script.google.com/macros/s/AKfycbyFDX-Sld5uXa3go-xFaA_wVV9N39pKp2VIZ-8ZkeO1HBjl4d3WSOA34MDmLsOMuLHq/exec";
const WHATSAPP_NUMBER = "918349217679";

const detailContainer = document.getElementById("product-detail");

function getProductIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

async function loadProductDetail() {
  const productId = getProductIdFromURL();

  try {
    const response = await fetch(API_URL);
    const products = await response.json();

    const product = products.find(p => String(p["Product ID"]) === String(productId));

    if (!product) {
      detailContainer.innerHTML = "<p>Product not found.</p>";
      return;
    }

    let imageUrl = "https://placehold.co/400x300?text=No+Image";
    if (product["Image URL"] && product["Image URL"].trim() !== "") {
      imageUrl = product["Image URL"];
    }

    const message = encodeURIComponent(`Hi, I'm interested in ${product["Product Name"]}. Please share more details.`);
    const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;

    detailContainer.innerHTML = `
      <div class="detail-card">
        <img src="${imageUrl}" alt="${product["Product Name"]}">
        <h2>${product["Product Name"] || ""}</h2>
        <p><b>Company:</b> ${product["Company"] || ""}</p>
        <p><b>Brand:</b> ${product["Brand"] || ""}</p>
        <p><b>Category:</b> ${product["Category"] || ""}</p>
        <p><b>Sub Category:</b> ${product["Sub Category"] || ""}</p>
        <p><b>Size:</b> ${product["Size"] || ""}</p>
        <p><b>Pack Size:</b> ${product["Pack Size"] || ""}</p>
        <p><b>UOM:</b> ${product["UOM"] || ""}</p>
        <p><b>MRP:</b> ₹${product["MRP"] || ""}</p>
        <p><b>Product Code:</b> ${product["Product Code"] || ""}</p>
        <p><b>Description:</b> ${product["Description"] || ""}</p>
        <a href="${whatsappLink}" target="_blank" class="whatsapp-btn">Enquire on WhatsApp</a>
        <br><br>
        <a href="index.html">← Back to all products</a>
      </div>`;
  } catch (error) {
    detailContainer.innerHTML = "<p>Could not load product details.</p>";
    console.error(error);
  }
}

loadProductDetail();
