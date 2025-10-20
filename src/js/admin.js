

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } 
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

const correctPassword = "0000";
const userPassword = prompt("Admin panelga kirish uchun parolni kiriting:");

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const form = document.getElementById("productForm");
const titleInput = document.getElementById("title");
const priceInput = document.getElementById("price");
const imageInput = document.getElementById("image");
const categoryInput = document.getElementById("category");
const descInput = document.getElementById("description");
const dateInput = document.getElementById("date");
const adminProducts = document.getElementById("admin-products");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const newProduct = {
    title: titleInput.value,
    price: Number(priceInput.value),
    image: imageInput.value,
    category: categoryInput.value,
    description: descInput.value,
    date: dateInput.value,
  };

  try {
    await addDoc(collection(db, "products"), newProduct);
    alert("✅ Mahsulot muvaffaqiyatli qo‘shildi!");
    form.reset();
    renderProducts(); 
  } catch (error) {
    alert("Xatolik: " + error.message);
  }
});

async function renderProducts() {
  adminProducts.innerHTML = "";
  const querySnapshot = await getDocs(collection(db, "products"));
  querySnapshot.forEach((docSnap) => {
    const product = docSnap.data();
    const card = document.createElement("div");
    card.className = "bg-white p-4 shadow rounded border border-gray-100 hover:shadow-lg transition-all";

    card.innerHTML = `
      <img src="${product.image}" class="w-full h-48 object-cover rounded mb-3">
      <h3 class="font-semibold text-gray-800">${product.title}</h3>
      <p class="text-gray-600 mb-1">${product.price.toLocaleString()} so'm</p>
      <span class="inline-block bg-indigo-100 text-indigo-600 text-xs font-semibold px-2 py-1 rounded-full mb-3">
        ${product.category || "Kategoriya yo‘q"}
      </span>
      <p class="text-sm text-gray-500 mb-1">📅 ${product.date || "Sana kiritilmagan"}</p>
      <button class="bg-red-500 text-white px-3 py-1 rounded delete-btn w-full mt-2 hover:bg-red-600" data-id="${docSnap.id}">
        O‘chirish
      </button>
    `;
    adminProducts.appendChild(card);
  });

  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      if (confirm("Haqiqatan ham o‘chirmoqchimisiz?")) {
        await deleteDoc(doc(db, "products", id));
        renderProducts();
      }
    });
  });
}

if (userPassword === correctPassword) {
  document.getElementById("adminBody").classList.remove("hidden");
} else {
  alert("Noto‘g‘ri parol! Bosh sahifaga qaytmoqdasiz.");
  window.location.href = "./index.html";
}

renderProducts();
