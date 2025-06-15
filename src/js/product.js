import { getParam } from './utils.mjs';
import { setLocalStorage } from './utils.mjs';
import ProductData from './ProductData.mjs';
import ProductDetails from './ProductDetails.mjs';
import { applyDiscountBadges } from './utils/price.js';

const productId = getParam('product');
const dataSource = new ProductData('tents');
const product = new ProductDetails(productId, dataSource);

function getLocalStorage(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

function addProductToCart(productObj) {
  const cart = getLocalStorage('so-cart');
  cart.push(productObj);
  setLocalStorage('so-cart', cart);
}

async function addToCartHandler(e) {
  const id = e.target.dataset.id;
  if (!id) return;
  const productObj = await dataSource.findProductById(id);
  addProductToCart(productObj);
}

document.addEventListener('DOMContentLoaded', async () => {
  await product.init();

  const btn = document.getElementById('addToCart');
  if (btn) btn.addEventListener('click', addToCartHandler);

  applyDiscountBadges();
});
