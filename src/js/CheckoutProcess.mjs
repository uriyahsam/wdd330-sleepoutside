import { getLocalStorage } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

const services = new ExternalServices();

// Converts a form element's data into a plain JSON object
function formDataToJSON(formElement) {
  const formData = new FormData(formElement);
  return Object.fromEntries(formData);
}

// Maps cart items into the required structure for the order payload
function packageItems(items) {
  return items.map((item) => ({
    id: item.Id,
    name: item.Name,
    price: item.FinalPrice,
    quantity: item.quantity || 1
  }));
}

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key;                     // LocalStorage key for the cart
    this.outputSelector = outputSelector; // CSS selector for outputting totals
    this.list = [];                     // List of cart items
    this.itemTotal = 0;                 // Total price of items (subtotal)
    this.shipping = 0;                  // Shipping cost
    this.tax = 0;                       // Tax amount
    this.orderTotal = 0;                // Final order total including tax & shipping
  }

  // Initialize the cart summary and calculate totals
  init() {
    this.list = getLocalStorage(this.key) || [];
    if (this.list.length === 0) {
      console.warn("Cart is empty");
      return;
    }
    this.calculateItemSummary();
    this.calculateOrderTotal();
  }

  // Calculate subtotal and update the displayed number of items and total
  calculateItemSummary() {
    this.itemTotal = this.list.reduce((sum, item) => {
      return sum + (parseFloat(item.FinalPrice) * (item.quantity || 1));
    }, 0);

    document.querySelector(`${this.outputSelector} #num-items`).textContent = this.list.length;
    document.querySelector(`${this.outputSelector} #cartTotal`).textContent = `$${this.itemTotal.toFixed(2)}`;
  }

  // Calculate tax, shipping, and final order total, then display them
  calculateOrderTotal() {
    this.tax = this.itemTotal * 0.06; // 6% sales tax
    this.shipping = 10 + (this.list.length - 1) * 2; // Base $10 + $2 per additional item
    this.orderTotal = this.itemTotal + this.tax + this.shipping;

    this.displayOrderTotals();
  }

  // Update the DOM elements for tax, shipping, and order total
  displayOrderTotals() {
    const elements = {
      tax: `${this.outputSelector} #tax`,
      shipping: `${this.outputSelector} #shipping`,
      orderTotal: `${this.outputSelector} #orderTotal`
    };

    Object.entries(elements).forEach(([key, selector]) => {
      const element = document.querySelector(selector);
      if (element) {
        element.textContent = `$${this[key].toFixed(2)}`;
      }
    });
  }

  // Process the checkout by sending order data to backend API
  async checkout() {
    const formElement = document.forms["checkout"];
    const order = {
      ...formDataToJSON(formElement),
      orderDate: new Date().toISOString(),
      orderTotal: this.orderTotal,
      tax: this.tax,
      shipping: this.shipping,
      items: packageItems(this.list)
    };

    try {
      const response = await services.checkout(order);
      console.log("Order successful:", response);
      localStorage.removeItem(this.key); // Clear the cart after successful order
      window.location.href = "/order-success.html"; // Redirect to success page
    } catch (err) {
      console.error("Checkout failed:", err);
      alert("Error processing order. Please try again.");
    }
  }
}
