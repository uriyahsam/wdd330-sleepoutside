import { getLocalStorage, setLocalStorage } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

// Create data source instance with default category "tents"
const dataSource = new ExternalServices("tents");

// 2. Improved function to add a product to the cart
function addProductToCart(product) {
  try {
    // Thorough validation of product object
    if (!product || typeof product !== 'object') {
      throw new Error("Invalid product");
    }

    const requiredFields = ['Id', 'Name', 'FinalPrice'];
    const missingFields = requiredFields.filter(field => !product[field]);

    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    const cart = getLocalStorage("so-cart") || [];

    // Create cart item with consistent structure
    const cartItem = {
      Id: product.Id,
      Name: product.Name,
      FinalPrice: parseFloat(product.FinalPrice),
      Image: product.Images?.[0]?.Image || "/images/placeholder.jpg", // Fallback placeholder image
      quantity: 1
    };

    // Check if product already exists in cart
    const existingItemIndex = cart.findIndex(item => item.Id === product.Id);

    if (existingItemIndex !== -1) {
      cart[existingItemIndex].quantity += 1; // Increase quantity if found
    } else {
      cart.push(cartItem); // Add new product to cart
    }

    setLocalStorage("so-cart", cart);
    return true; // Indicate success

  } catch (error) {
    console.error("Error in addProductToCart:", error);
    return false; // Indicate failure
  }
}

// 3. Improved event handler with all validations
async function addToCartHandler(e) {
  try {
    e.preventDefault(); // Prevent default button behavior

    // Verify clicked element is the addToCart button or inside it
    const addToCartButton = e.target.closest('#addToCart');
    if (!addToCartButton) {
      console.warn('Clicked element is not the addToCart button');
      return;
    }

    // Get product ID from button dataset
    const productId = addToCartButton.dataset.id;
    if (!productId) {
      throw new Error("Button does not have a valid product ID");
    }

    // Critical check for product service method
    if (!dataSource.findProductById || typeof dataSource.findProductById !== 'function') {
      throw new Error("Incorrect product service configuration");
    }

    // Fetch product details from API
    const product = await dataSource.findProductById(productId);
    if (!product?.Id) {
      throw new Error("Failed to retrieve product information");
    }

    // Add product to cart and redirect
    const success = addProductToCart(product);
    if (success) {
      // Redirect after adding product successfully
      window.location.href = "/cart/index.html"; // Adjust path as needed
    } else {
      throw new Error("Failed to add product to cart");
    }

  } catch (error) {
    console.error("Full error in addToCartHandler:", {
      error: error.message,
      stack: error.stack,
      dataSource: dataSource, // For debugging
      target: e.target
    });
    alert(`Error adding to cart: ${error.message}`);
  }
}

// 4. Improved safe initialization of event listener
function initializeCart() {
  const addToCartBtn = document.getElementById("addToCart");

  if (addToCartBtn) {
    // Remove previous event listeners to avoid duplicates
    addToCartBtn.removeEventListener("click", addToCartHandler);
    addToCartBtn.addEventListener("click", addToCartHandler);
    console.log("addToCart listener configured successfully");
  } else {
    console.warn('Add to Cart button not found - check your HTML');
  }
}

// 5. Optimized initialization: Wait for DOM ready before attaching listeners
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeCart);
} else {
  // DOM already loaded, run with small delay to ensure readiness
  setTimeout(initializeCart, 100);
}
