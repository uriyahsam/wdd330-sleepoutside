import { getParam } from './utils.mjs';

export function renderBreadcrumbs(categoryName, itemCount = null) {
  const nav = document.querySelector('.breadcrumb');
  if (!nav) return;

  nav.innerHTML = '';

  if (!categoryName) return; // Home: no breadcrumb

  const homeLink = `<a href="/index.html">Home</a>`;
  let inner = '';

  if (itemCount !== null) {
    inner = `${categoryName} (${itemCount} item${itemCount !== 1 ? 's' : ''})`;
  } else {
    inner = categoryName; // individual product page
  }

  nav.innerHTML = `${homeLink} <span>›</span> ${inner}`;
}
