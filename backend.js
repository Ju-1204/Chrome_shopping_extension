chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Check if the message is for saving a product
  if (request.action === 'saveProduct') {
    const product = request.product;
    console.log('Received product to save:', product);

    // Save the product to local storage
    saveProductToStorage(product);
  }
});


 //Saves a product to chrome.storage.local and notifies the popup to refresh.
function saveProductToStorage(product) {
  // Get existing products from storage (or initialize an empty array)
  chrome.storage.local.get(['products'], (result) => {
    const products = result.products || [];

    // Add the new product to the array
    products.push(product);

    // Save the updated array back to storage
    chrome.storage.local.set({ products }, () => {
      console.log('Product saved successfully:', product);
    });
  });
}