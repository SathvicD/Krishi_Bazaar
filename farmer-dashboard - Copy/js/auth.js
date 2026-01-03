import { auth, db } from "./firebaseConfig.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* ---------- INPUT ELEMENTS ---------- */

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const mobileInput = document.getElementById("mobile");

/* ---------- REGISTER FARMER ---------- */

document.getElementById("registerBtn").addEventListener("click", async () => {
  try {
    // 🔒 Validate mobile number BEFORE creating user
    if (!/^[6-9]\d{9}$/.test(mobileInput.value)) {
      alert("Enter valid 10-digit mobile number");
      return;
    }

    const userCred = await createUserWithEmailAndPassword(
      auth,
      emailInput.value,
      passwordInput.value
    );

    // Save farmer profile in Firestore
    await setDoc(doc(db, "farmers", userCred.user.uid), {
      email: emailInput.value,
      mobile: mobileInput.value,
      available: true,
      location: null
    });

    alert("User registered successfully!");
    window.location.href = "dashboard.html";

  } catch (error) {
    console.error(error);
    alert(error.message);
  }
});

/* ---------- LOGIN FARMER ---------- */

document.getElementById("loginBtn").addEventListener("click", async () => {
  try {
    await signInWithEmailAndPassword(
      auth,
      emailInput.value,
      passwordInput.value
    );

    window.location.href = "dashboard.html";

  } catch (error) {
    alert(error.message);
  }
});
