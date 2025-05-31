import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

loadHeaderFooter();

const checkout = new CheckoutProcess("so-cart", ".order__summary");
checkout.init();

document.getElementById("zip").addEventListener("blur", () => {
  checkout.calculateOrderTotal();
});

document.forms["checkout"].addEventListener("submit", (e) => {
  e.preventDefault();
  checkout.checkout();
});