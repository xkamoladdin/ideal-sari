

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs } 
  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCXai9rX4GgA7o4lNZekVapAm6v5yBTPaY",
  authDomain: "idealsari-13274.firebaseapp.com",
  projectId: "idealsari-13274",
  storageBucket: "idealsari-13274.firebasestorage.app",
  messagingSenderId: "974825187243",
  appId: "1:974825187243:web:a63028bac02a169b2954ee",
  measurementId: "G-0380YDYBZ1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const productList = document.getElementById("product-list");
const loadingText = document.getElementById("loading");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const priceSort = document.getElementById("priceSort");

let allProducts = [];
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

const modal = document.createElement("div");
modal.className = "fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50";
modal.innerHTML = `
  <div class="bg-white rounded-2xl shadow-xl w-[50%] max-w-[400px] p-6 relative">
    <button id="closeModal" class="absolute top-3 right-4 text-gray-600 text-2xl font-bold">&times;</button>
    <img id="modalImg" class="w-full h-64 object-contain bg-gray-100 rounded mb-3 p-2">
    <h2 id="modalTitle" class="text-2xl font-semibold mb-2"></h2>
    <p id="modalDesc" class="text-gray-600 mb-3"></p>
    <p id="modalPrice" class="text-lg font-semibold text-red-600 mb-1"></p>
    <p id="modalOldPrice" class="text-sm text-gray-400 mb-2"></p>
    <span id="modalCategory" class="inline-block bg-red-100 text-red-600 text-xs font-semibold px-3 py-1 rounded-full mb-2"></span>
    <p id="modalDate" class="text-sm text-gray-500 mb-1"></p>
  </div>
`;
document.body.appendChild(modal);
modal.querySelector("#closeModal").addEventListener("click", () => modal.classList.add("hidden"));

function openModal(product) {
  modal.querySelector("#modalImg").src = product.image;
  modal.querySelector("#modalTitle").textContent = product.title;
  modal.querySelector("#modalDesc").textContent = product.description || "Tavsif kiritilmagan.";
  modal.querySelector("#modalPrice").textContent = `${product.price.toLocaleString()} so‘m`;
  modal.querySelector("#modalOldPrice").textContent = `Eski narx: ${product.oldPrice.toLocaleString()} so‘m (-${product.discount}%)`;
  modal.querySelector("#modalCategory").textContent = product.category || "Kategoriya yo‘q";
  modal.querySelector("#modalDate").textContent = `📅 Qo‘shilgan sana: ${product.date || "Kiritilmagan"}`;
  modal.classList.remove("hidden");
}

async function loadProducts() {
  const querySnapshot = await getDocs(collection(db, "products"));
  productList.innerHTML = "";
  loadingText?.remove();
  allProducts = [];

  let savedDiscounts = JSON.parse(localStorage.getItem("discounts")) || {};

  querySnapshot.forEach((docSnap) => {
    const product = docSnap.data();
    const productId = docSnap.id;

    if (!savedDiscounts[productId]) {
      savedDiscounts[productId] = Math.floor(Math.random() * 28) + 2;
    }

    const discount = savedDiscounts[productId];
    const newPrice = product.price;
    const oldPrice = Math.round(newPrice + (newPrice * discount) / 100);

    allProducts.push({
      id: productId,
      ...product,
      discount,
      oldPrice,
      price: newPrice
    });
  });

  localStorage.setItem("discounts", JSON.stringify(savedDiscounts));
  renderProducts(allProducts);
  populateCategories();
}

function populateCategories() {
  const categories = [...new Set(allProducts.map(p => p.category).filter(Boolean))];
  categoryFilter.innerHTML = `<option value="">Barcha toifalar</option>`;
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });
}

function renderProducts(products) {
  productList.innerHTML = "";

  if (products.length === 0) {
    productList.innerHTML = `<p class="col-span-full text-center text-gray-500">Hech narsa topilmadi 😕</p>`;
    return;
  }

  products.forEach(product => {
    const isLiked = wishlist.some(item => item.id === product.id);

    const card = document.createElement("div");
    card.className = `
      w-[250px] bg-white border border-red-500 rounded-2xl overflow-hidden shadow-md 
      transition-all duration-300 
    `;

    // <span class="inline-block bg-red-100 text-red-600 text-xs font-semibold px-3 py-1 rounded-full">
    //   ${product.category || "Kategoriya yo‘q"}
    // </span>
    card.innerHTML = `
      <div class="relative">
        <img src="${product.image}" class="w-full h-[200px] object-contain bg-white p-2">
        <div class="absolute top-2 right-2 flex items-center gap-2">
          <div class="bg-red-500 text-white text-xs px-2 py-1 rounded-full shadow-md">-${product.discount}%</div>
          <button class="like-btn text-2xl ${isLiked ? "text-red-600" : "text-gray-400"} hover:scale-110 transition-all">❤️</button>
        </div>
      </div>
      <div class="p-4 text-center space-y-2">
        <div>
          <p class="text-red-600 text-xl font-bold">${product.price.toLocaleString()} so'm</p>
          <del class="text-gray-400 text-sm">${product.oldPrice.toLocaleString()} so'm</del>
        </div>
        <h3 class="text-lg font-semibold text-gray-800 line-clamp-1">${product.title}</h3>
        <button 
          class="detail-btn mt-2 w-full py-2 bg-red-600 text-white font-semibold rounded-full 
          hover:bg-white hover:text-red-600 border-2 border-red-600 transition-all duration-300">
          Batafsil
        </button>
      </div>
    `;

    const likeBtn = card.querySelector(".like-btn");
    likeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleLike(product, likeBtn);
    });

    const detailBtn = card.querySelector(".detail-btn");
    detailBtn.addEventListener("click", () => openModal(product));

    productList.appendChild(card);
  });
}

function toggleLike(product, btn) {
  const index = wishlist.findIndex(item => item.id === product.id);
  if (index >= 0) {
    wishlist.splice(index, 1);
    btn.classList.remove("text-red-600");
    btn.classList.add("text-gray-400");
  } else {
    wishlist.push(product);
    btn.classList.add("text-red-600");
    btn.classList.remove("text-gray-400");
  }
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
}

function applyFilters() {
  let filtered = [...allProducts];
  const searchValue = searchInput?.value.toLowerCase() || "";
  const selectedCategory = categoryFilter?.value || "";
  const sortType = priceSort?.value || "";

  if (searchValue) filtered = filtered.filter(p => p.title.toLowerCase().includes(searchValue));
  if (selectedCategory) filtered = filtered.filter(p => p.category === selectedCategory);
  if (sortType === "asc") filtered.sort((a, b) => a.price - b.price);
  else if (sortType === "desc") filtered.sort((a, b) => b.price - a.price);

  renderProducts(filtered);
}

searchInput?.addEventListener("input", applyFilters);
categoryFilter?.addEventListener("change", applyFilters);
priceSort?.addEventListener("change", applyFilters);

loadProducts();










