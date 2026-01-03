import { auth, db } from "./firebaseConfig.js";
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  orderBy,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const productNameInput = document.getElementById("productName");
const priceInput = document.getElementById("price");
const addProductBtn = document.getElementById("addProduct");
const productList = document.getElementById("productList");

auth.onAuthStateChanged((user) => {
  if (!user) return;

  const productsRef = collection(db, "farmerProducts");

  // 🔥 ADD PRODUCT
  addProductBtn.addEventListener("click", async () => {
    const productName = productNameInput.value.trim();
    const price = priceInput.value.trim();

    if (!productName || !price) {
      alert("Enter product name & price");
      return;
    }

    await addDoc(productsRef, {
      farmerId: user.uid,
      productName,
      price,
      createdAt: serverTimestamp()
    });

    productNameInput.value = "";
    priceInput.value = "";
  });

  // 🔥 LIVE PRODUCTS
  const q = query(
    productsRef,
    where("farmerId", "==", user.uid),
    orderBy("createdAt", "desc")
  );

  onSnapshot(q, (snapshot) => {
    productList.innerHTML = "";
    snapshot.forEach((doc) => {
      const p = doc.data();
      const div = document.createElement("div");
      div.className = "product-card";
      div.textContent = `${p.productName} - ₹${p.price}`;
      productList.appendChild(div);
    });
  });
});
