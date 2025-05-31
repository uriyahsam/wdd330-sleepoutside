// ProductList.mjs
/*--ec-- modified/ added this entire section */

import { renderListWithTemplate } from './utils.mjs'; 

function productCardTemplate(product) {
  return `<li class="product-card">
    <a href="product_pages/?product=${product.Id}">
      <img src="${product.Image}" alt="Image of ${product.Name}">
      <h2 class="card__brand">${product.Brand.Name}</h2>
      <h3 class="card__name">${product.Name}</h3>
      <p class="product-card__price">$${product.FinalPrice}</p>
    </a>
  </li>`;
} 

export default class ProductList {
  constructor(category, dataSource, listElement) {
    // this information is passed to make the class as reusable as possible.
    // Being able to define these things when you use the class will make it very flexible  
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
    this.originalList = []; // added to store full product list for sorting
  }

  async init() {
    this.originalList = await this.dataSource.getData(); //this will store the full product list
    this.renderList(this.originalList);                  //this wil render initially
    this.setupSortListener();                            //to enable sorting dropdown
}

renderList(list) {
  renderListWithTemplate(productCardTemplate, this.listElement, list);
}

setupSortListener() {
  console.log("Sort listener set up");
  const sortElement = document.querySelector('#sort');
  if (!sortElement) return;

  sortElement.addEventListener('change', (e) => {
    const value = e.target.value;
    let sortedList = [...this.originalList];

    if (value === 'name') {
      sortedList.sort((a, b) => a.Name.localeCompare(b.Name));
    } else if (value === 'price') {
      sortedList.sort((a, b) => a.FinalPrice - b.FinalPrice);
    }

    this.renderList(sortedList);
  });
}
}