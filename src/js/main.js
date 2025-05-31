import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";

document.addEventListener("DOMContentLoaded", () => {
  const dataSource = new ProductData("tents");
  const listElement = document.querySelector(".product-list");
  const tentList = new ProductList("tents", dataSource, listElement);
  tentList.init(); // To start fetching and rendering
});
