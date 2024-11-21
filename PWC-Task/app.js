let products = [];

function loadProducts() {
  const localData = localStorage.getItem("products");

  if (localData) {
    products = JSON.parse(localData);
    displayProducts(products);
  } else {
    fetch("https://fakestoreapi.com/products")
      .then(response => response.json())
      .then(data => {
        products = data;
        localStorage.setItem("products", JSON.stringify(products));
        displayProducts(products);
      });
  }
}

function displayProducts(productList) {
  const container = document.getElementById("product-container");
  const resultsCount = document.getElementById("results-count");

  container.innerHTML = "";
  resultsCount.textContent = `${productList.length} Results`;

  productList.forEach(product => {
    const truncatedTitle = truncateTitle(product.title);

    container.innerHTML += `
      <div class="col-12 col-sm-6 col-md-4">
        <div class="product card shadow-sm p-3">
          <img src="${product.image}" alt="${product.title}" class="card-img-top" />
          <div class="product-title card-title" onclick="showFullTitle(this)" title="${product.title}">
            ${truncatedTitle}
          </div>
          <div class="product-price text-success">$${product.price}</div>
          <i class="fa fa-heart heart-icon" onclick="toggleFavorite(this)"></i>
        </div>
      </div>
    `;
  });
}

function truncateTitle(title) {
  return title.length > 20 ? title.substring(0, 20) + "..." : title;
}

function showFullTitle(element) {
  const isTruncated = element.textContent.endsWith("...");
  element.textContent = isTruncated ? element.getAttribute("title") : truncateTitle(element.getAttribute("title"));
}

function toggleFavorite(element) {
  element.classList.toggle('active');
}

function filterByCategory() {
  const selectedCategories = getSelectedCategories();
  const filtered = selectedCategories.length ? filterProductsByCategory(selectedCategories) : products;
  displayProducts(filtered);
}

function getSelectedCategories() {
  return Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(checkbox => checkbox.value);
}

function filterProductsByCategory(categories) {
  return products.filter(product => categories.includes(product.category));
}

function sortByPrice(order) {
  const sorted = [...products].sort((a, b) => order === 'asc' ? a.price - b.price : b.price - a.price);
  displayProducts(sorted);
}

document.getElementById("menu-toggle").addEventListener("click", () => {
  document.querySelector("nav").classList.toggle("d-none");
});

document.addEventListener("DOMContentLoaded", loadProducts);