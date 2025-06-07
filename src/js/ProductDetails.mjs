import { setLocalStorage } from './utils.mjs';

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    this.product = await this.dataSource.findProductById(this.productId);
    this.renderProductDetails();
    document
      .getElementById('addToCart')
      .addEventListener('click', this.addProductToCart.bind(this));
  }

  addProductToCart() {
    const currentCart = JSON.parse(localStorage.getItem('so-cart')) || [];
    setLocalStorage('so-cart', [...currentCart, this.product]);
  }

  renderProductDetails() {
    document.querySelector('.product-detail').innerHTML = `
      <h3>${this.product.Name}</h3>
      <img src="${this.product.PrimaryLarge}" alt="${this.product.Name}" />
      <p class="product-card__price">$${this.product.FinalPrice}</p>
      <div id="colorOptions"></div>
      <button id="addToCart">Add to Cart</button>
    `;

    const colorContainer = document.getElementById('colorOptions');
    if (this.product.Color && this.product.Color.length > 0) {
      colorContainer.innerHTML = `<h4>Available Colors:</h4>`;
      this.product.Color.forEach(color => {
        const span = document.createElement('span');
        span.textContent = color;
        span.style.marginRight = '10px';
        span.style.padding = '5px 10px';
        span.style.border = '1px solid #ccc';
        span.style.borderRadius = '5px';
        span.style.backgroundColor = color.toLowerCase();
        span.style.color = ['white', 'black'].includes(color.toLowerCase()) ? 'black' : 'white';
        colorContainer.appendChild(span);
      });
    }
  }
}
