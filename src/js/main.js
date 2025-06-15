import ProductData from './ProductData.mjs';
import { applyDiscountBadges } from './utils/price.js'; // <-- Import badge logic

const dataSource = new ProductData('tents');
const productListElement = document.querySelector('.product-list');

dataSource.getData().then((data) => {
  renderProductList(data, productListElement);
  applyDiscountBadges();
});

function renderProductList(productList, element) {
  const html = productList.map(product => productCardTemplate(product));
  element.innerHTML = html.join('');
}

function productCardTemplate(product) {
  return `
    <li class="product-card">
      <a href="product_pages/index.html?product=${product.Id}">
        <img src="${product.Image}" alt="${product.Name}" />
        <h3 class="card__brand">${product.Brand.Name}</h3>
        <h2 class="card__name">${product.Name}</h2>
        <p class="product-card__price" data-list-price="${product.SuggestedRetailPrice}">
          $${product.FinalPrice.toFixed(2)}
        </p>
      </a>
    </li>
  `;
}
