const container = document.getElementById("wishlist-container");
const emptyText = document.getElementById("emptyText");

let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

function renderWishlist() {
  container.innerHTML = "";

  if (wishlist.length === 0) {
    emptyText.classList.remove("hidden");
    return;
  } else {
    emptyText.classList.add("hidden");
  }

  wishlist.forEach(product => {
    const card = document.createElement("div");
    card.className = `
      w-[250px] bg-white border border-red-500 rounded-2xl overflow-hidden shadow-md 
      transition-all duration-300 hover:shadow-2xl hover:-translate-y-1
    `;

    card.innerHTML = `
      <div class="relative">
        <img src="${product.image}" class="w-full h-[200px] object-contain bg-white p-2">
        <div class="absolute top-2 right-2 flex items-center gap-2">
          <div class="bg-red-500 text-white text-xs px-2 py-1 rounded-full shadow-md">-${product.discount}%</div>
          <button class="remove-btn text-2xl text-red-600 hover:scale-110 transition-all">🗑️</button>
        </div>
      </div>
      <div class="p-4 text-center space-y-2">
        <div>
          <p class="text-red-600 text-xl font-bold">${product.price.toLocaleString()} so'm</p>
          <del class="text-gray-400 text-sm">${product.oldPrice.toLocaleString()} so'm</del>
        </div>
        <span class="inline-block bg-red-100 text-red-600 text-xs font-semibold px-3 py-1 rounded-full">
          ${product.category || "Kategoriya yo‘q"}
        </span>
        <h3 class="text-lg font-semibold text-gray-800 line-clamp-1">${product.title}</h3>
      </div>
    `;

    const removeBtn = card.querySelector(".remove-btn");
    removeBtn.addEventListener("click", () => removeFromWishlist(product.id));

    container.appendChild(card);
  });
}

function removeFromWishlist(id) {
  wishlist = wishlist.filter(p => p.id !== id);
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  renderWishlist();
}

renderWishlist();
