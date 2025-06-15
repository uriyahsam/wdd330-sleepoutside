export function getDiscountPercentage(listPrice, finalPrice) {
  if (
    typeof listPrice !== 'number' ||
    typeof finalPrice !== 'number' ||
    finalPrice >= listPrice
  ) {
    return 0;
  }
  const discount = ((listPrice - finalPrice) / listPrice) * 100;
  return Math.round(discount);
}

export function applyDiscountBadges() {
  const priceEls = document.querySelectorAll('.product-card__price, .product-detail .product-card__price');
  priceEls.forEach(priceEl => {
    const text = priceEl.textContent.replace(/[^0-9.]/g, '');
    const finalPrice = parseFloat(text);
    const listAttr = priceEl.getAttribute('data-list-price');
    const listPrice = listAttr ? parseFloat(listAttr) : null;

    if (listPrice && finalPrice < listPrice) {
      const discount = getDiscountPercentage(listPrice, finalPrice);
      if (discount > 0 && !priceEl.querySelector('.discount-badge')) {
        const badge = document.createElement('span');
        badge.className = 'discount-badge';
        badge.textContent = `–${discount}% off`;
        priceEl.appendChild(badge);
      }
    }
  });
}
