import { getParam } from './utils.mjs';
import ProductData from './ProductData.mjs';
import ProductDetails from './ProductDetails.mjs';
import { applyDiscountBadges } from './utils/price.js';

const productId = getParam('product');
const dataSource = new ProductData('tents');
const product = new ProductDetails(productId, dataSource);

document.addEventListener('DOMContentLoaded', () => {
  product.init();
  applyDiscountBadges();
});
