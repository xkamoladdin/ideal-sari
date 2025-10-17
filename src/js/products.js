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

async function loadProducts() {
  const querySnapshot = await getDocs(collection(db, "products"));
  productList.innerHTML = "";
  loadingText.remove();

  querySnapshot.forEach((docSnap) => {
    const product = docSnap.data();
    const card = document.createElement("div");
    card.className = "bg-white rounded-lg w-[200px] p-4";
    card.innerHTML = `
      <img src="${product.image}" class="w-full h-56 object-cover rounded mb-3">
      <h3 class="font-semibold text-lg">${product.title}</h3>
      <p class="text-gray-600">${product.price.toLocaleString()} so'm</p>
    `;
    productList.appendChild(card);
  });
}

loadProducts();
