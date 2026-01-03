import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDj_Is7nJomz1diM12QR_8ZRCng6NgxoQA",
  authDomain: "farmer-dashboard-84b45.firebaseapp.com",
  projectId: "farmer-dashboard-84b45",
  storageBucket: "farmer-dashboard-84b45.firebasestorage.app",
  messagingSenderId: "523333013278",
  appId: "1:523333013278:web:06e790882e96f86e65830f",
  measurementId: "G-WVB81JZJCV"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
