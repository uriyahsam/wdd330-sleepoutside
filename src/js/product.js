import { setLocalStorage } from "./utils.mjs";
import ProductData from "./ProductData.mjs";

const dataSource = new ProductData("tents");

// The Issue is with this function
/**
function addProductToCart(product) {
  setLocalStorage("so-cart", product);
}
EXPLANATION:
setLocalStorage("so-cart", product) overwrites 
the "so-cart" key in localStorage with just the latest product.
So if we add "Item A", it stores just "Item A". 
Then we add "Item B", and it replaces it — "Item A" is gone.
 */
// SOLUTION TO FIX THE PROBLEM:
// Defining the getLocalStorage
function getLocalStorage(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}
// Read the current cart from local storage.
// If there's nothing, use an empty array.
// Add the new product to the cart.
// Save the updated cart back to local storage.
function addProductToCart(product) {
  let cart = getLocalStorage("so-cart") || [];
  cart.push(product);
  setLocalStorage("so-cart", cart);
}

// add to cart button event handler
async function addToCartHandler(e) {
  const product = await dataSource.findProductById(e.target.dataset.id);
  addProductToCart(product);
}

// add listener to Add to Cart button
document
  .getElementById("addToCart")
  .addEventListener("click", addToCartHandler);
