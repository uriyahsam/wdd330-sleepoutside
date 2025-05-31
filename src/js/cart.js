import { getLocalStorage, setLocalStorage } from "./utils.mjs";

export default class Cart {
  /**
   * Cart class constructor.
   * @param {string} key - The key used to save and retrieve cart data from localStorage.
   */
  constructor(key) {
    this.key = key;
    // Retrieve saved items from localStorage or initialize an empty array if none exist
    this.items = getLocalStorage(this.key) || [];
    // Render the cart items to the DOM
    this.renderCartContents();
    // Update the cart totals display (subtotal, tax, shipping, total)
    this.updateCartDisplay();
  }

  /**
   * Renders the products stored in the cart inside the HTML container.
   */
  renderCartContents() {
    // Create an array of HTML strings for each item using the cartItemTemplate method
    const htmlItems = this.items.map((item) => this.cartItemTemplate(item));
    // Insert the HTML for all items inside the container with the class "product-list"
    document.querySelector(".product-list").innerHTML = htmlItems.join("");
    
    // Select the list footer element to show or hide based on whether there are items in the cart
    const listFooter = document.querySelector(".list-footer");
    // Add the 'hide' class to the footer if there are no items; remove it otherwise
    listFooter.classList.toggle("hide", this.items.length === 0);
  }

  /**
   * HTML template for an individual cart item.
   * @param {Object} item - The product object containing item details.
   * @returns {string} - An HTML string representing the cart item.
   */
  cartItemTemplate(item) {
    return `<li class="cart-card divider">
      <a href="#" class="cart-card__image">
        <img src="${item.Image}" alt="${item.Name}" />
      </a>
      <a href="#">
        <h2 class="card__name">${item.Name}</h2>
      </a>
      <p class="cart-card__color">${item.Colors?.[0]?.ColorName || ''}</p>
      <p class="cart-card__quantity">qty: ${item.quantity || 1}</p>
      <p class="cart-card__price">$${(item.FinalPrice || 0).toFixed(2)}</p>
    </li>`;
  }

  /**
   * Calculates and updates the cart totals display.
   * If the cart is empty, hides the totals section.
   */
  updateCartDisplay() {
    // If cart has no items, hide the cart totals section and exit the function
    if (this.items.length === 0) {
      document.querySelector(".cart-totals").style.display = "none";
      return;
    }

    // Calculate totals: subtotal, tax, shipping, and total amount
    const totals = this.calculateTotals();
    
    // Update the corresponding DOM elements with the calculated totals
    document.getElementById('cart-subtotal').textContent = `$${totals.subtotal}`;
    document.getElementById('cart-tax').textContent = `$${totals.tax}`;
    document.getElementById('cart-shipping').textContent = `$${totals.shipping}`;
    document.getElementById('cart-total').textContent = `$${totals.total}`;
  }

  /**
   * Calculates subtotal, tax, shipping, and total cost for the cart.
   * @returns {Object} An object with subtotal, tax, shipping, and total as strings with two decimals.
   */
  calculateTotals() {
    // Sum up the price * quantity for all items in the cart
    const subtotal = this.items.reduce((sum, item) => {
      return sum + (parseFloat(item.FinalPrice) * (item.quantity || 1));
    }, 0);

    // Calculate tax as 6% of subtotal
    const tax = subtotal * 0.06;
    // Calculate shipping cost: base $10 + $2 for each additional item beyond the first
    const shipping = 10 + (this.items.length - 1) * 2;
    // Total is the sum of subtotal, tax, and shipping
    const total = subtotal + tax + shipping;

    // Return all totals formatted as strings with two decimal places
    return {
      subtotal: subtotal.toFixed(2),
      tax: tax.toFixed(2),
      shipping: shipping.toFixed(2),
      total: total.toFixed(2)
    };
  }
}

// Initialize the cart when the page loads using the specified localStorage key
const cart = new Cart("so-cart");
