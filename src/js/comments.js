export function setupComments(productId) {
  const comments = JSON.parse(localStorage.getItem("comments")) || {};
  const productComments = comments[productId] || [];

  const list = document.getElementById("commentList");

  function renderComments() {
    list.innerHTML = "";
    productComments.forEach((comment) => {
      const li = document.createElement("li");
      li.textContent = comment;
      list.appendChild(li);
    });
  }

  renderComments();

  document.getElementById("commentForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const comment = document.getElementById("commentText").value.trim();
    if (comment) {
      productComments.push(comment);
      comments[productId] = productComments;
      localStorage.setItem("comments", JSON.stringify(comments));
      renderComments();
      e.target.reset();
    }
  });
}