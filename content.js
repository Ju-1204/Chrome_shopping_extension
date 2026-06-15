// Function to inject the "Save Product" button
function injectSaveButton() {
  // Check if the button already exists (to avoid duplicates)
  if (document.getElementById('vivaldi-save-product-btn')) {
    return;
  }

  // Create the button
  const button = document.createElement('button');
  button.id = 'save-product-btn';
  button.textContent = 'Save';
  button.style.position = 'fixed';
  button.style.bottom = '20px';
  button.style.right = '20px';
  button.style.zIndex = '9999';
  button.style.padding = '10px 15px';
  button.style.backgroundColor = '#3f3172';
  button.style.color = 'white';
  button.style.border = 'none';
  button.style.borderRadius = '5px';
  button.style.cursor = 'pointer';
  button.style.fontSize = '14px';
  button.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';

  // Add hover effect
  button.addEventListener('mouseover', () => {
    button.style.backgroundColor = '#1e1474';
  });
  button.addEventListener('mouseout', () => {
    button.style.backgroundColor = '#3f3172';
  });

  // Add click event: Send product data to the background script
  button.addEventListener('click', () => {
    const product = {
      url: window.location.href,
      title: document.title,
      image: getProductImage(),  // function to extract the product image
      price: getProductPrice(),  // function to extract the price
      timestamp: Date.now()
    };

    // Send the product data to the background script
    chrome.runtime.sendMessage({
      action: 'saveProduct',
      product: product
    });
  });

  // Append the button to the page
  document.body.appendChild(button);
}

// function to extract the product image
function getProductImage() {
  const images = document.querySelectorAll('img');
  // Look for the largest image (likely the product image)
  let largestImage = null;
  let largestArea = 0;
  images.forEach(img => {
    const width = img.naturalWidth || img.width || 0;
    const height = img.naturalHeight || img.height || 0;
    const area = width * height;
    if (area > largestArea && width > 100 && height > 100) {
      largestArea = area;
      largestImage = img.src;
    }
  });
  return largestImage;
}

// function to extract the product price
function getProductPrice() {
  // Common selectors for prices
  const priceSelectors = [
    '.price', '#price', '.product-price', '#product-price',
    '.amount', '.cost', '.final-price', '[class*="price"]',
    '[id*="price"]', '.currency', '.sale-price'
  ];

  for (const selector of priceSelectors) {
    const elements = document.querySelectorAll(selector);
    for (const el of elements) {
      const text = el.textContent.trim();
      // Check if the text looks like a price (e.g., $19.99, 20,00 €)
      if (text.match(/[\$€£¥]\d+[\.,]?\d*/)) {
          return text;
      }
    }
  }
  return null;
}

// Inject the button when the page loads
injectSaveButton();