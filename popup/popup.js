// DOM Elements
const productList = document.getElementById('product-list');
const emptyMessage = document.getElementById('empty-message');

// Load and display saved products
function loadProducts() {
  chrome.storage.local.get(['products'], (result) => {
    const products = result.products || [];

    if (products.length === 0) { // Show empty message if no products are saved
      emptyMessage.style.display = 'block';
      productList.innerHTML = '';
      return;
    }

    emptyMessage.style.display = 'none'; 
    productList.innerHTML = '';

    // Sort products by timestamp (newest first)
    products.sort((a, b) => b.timestamp - a.timestamp);

    products.forEach((product, index) => {
      const productItem = document.createElement('div'); // Create a container for each product
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

      const priceInput = document.createElement('input');
      priceInput.type = 'text';
      priceInput.className = 'price-input';
      priceInput.value = product.price || ''; // Default to scraped price or empty
      priceInput.placeholder = 'Enter price';
      // Save price when input loses focus (blur) or Enter is pressed
      priceInput.addEventListener('blur', () => {
        saveEditedPrice(product.url, priceInput.value);
      });
      priceInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          saveEditedPrice(product.url, priceInput.value);
          priceInput.blur(); // Directly blur the input field
        }
      });
      productInfo.appendChild(priceInput);
      productItem.appendChild(productInfo);

      // Add click event to open the product URL
      productItem.addEventListener('click', (e) => {
        if (e.target !== priceInput) {
          chrome.tabs.create({ url: product.url });
        }});

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

// Save edited price to storage
function saveEditedPrice(productUrl, newPrice) {
  chrome.storage.local.get(['products'], (result) => {
    const products = result.products || [];
    
    // Find the product by URL (stable identifier)
    const productIndex = products.findIndex(p => p.url === productUrl);
    
    if (productIndex !== -1) {
      products[productIndex].price = newPrice;
      
      chrome.storage.local.set({ products }, () => {
        console.log('Price updated successfully:', products[productIndex]);
        loadProducts(); // Refresh the UI to reflect the changes
      });
    }
  });
}

// Load products when the popup opens
loadProducts();