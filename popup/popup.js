// DOM Elements
const productList = document.getElementById('product-list');
const emptyMessage = document.getElementById('empty-message');

// Load and display saved products
function loadProducts() {
  chrome.storage.local.get(['products'], (result) => {
    const products = result.products || [];

    if (products.length === 0) {
      emptyMessage.style.display = 'block';
      productList.innerHTML = '';
      return;
    }

    emptyMessage.style.display = 'none';
    productList.innerHTML = '';

    // Sort products by timestamp (newest first)
    products.sort((a, b) => b.timestamp - a.timestamp);

    products.forEach((product, index) => {
      const productItem = document.createElement('div');
      productItem.className = 'product-item';

      // Add product image (if available)
      if (product.image) {
        const img = document.createElement('img');
        img.src = product.image;
        img.alt = product.title;
        productItem.appendChild(img);
      }

      // Add product info
      const productInfo = document.createElement('div');
      productInfo.className = 'product-info';

      const title = document.createElement('div');
      title.className = 'product-title';
      title.textContent = product.title;
      productInfo.appendChild(title);

      const url = document.createElement('div');
      url.className = 'product-url';
      url.textContent = product.url;
      productInfo.appendChild(url);

      if (product.price) {
        const price = document.createElement('div');
        price.className = 'product-price';
        price.textContent = product.price;
        productInfo.appendChild(price);
      }

      productItem.appendChild(productInfo);

      // Add click event to open the product URL
      productItem.addEventListener('click', () => {
        chrome.tabs.create({ url: product.url });
      });

      productList.appendChild(productItem);
    });
  });
}

// Listen for messages from the background script (e.g., when a new product is saved)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'refreshProducts') {
    loadProducts();
  }
});

// Load products when the popup opens
loadProducts();