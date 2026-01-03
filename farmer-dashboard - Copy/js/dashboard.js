import { auth, db } from "./firebaseConfig.js";
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const farmerMobileEl = document.getElementById("farmerMobile");
const noteDisplay = document.getElementById("noteDisplay");

auth.onAuthStateChanged(async (user) => {
  if (!user) return;

  const farmerRef = doc(db, "farmers", user.uid);

  // 🔥 LIVE farmer data
  onSnapshot(farmerRef, (snap) => {
    if (!snap.exists()) return;
    const data = snap.data();
    farmerMobileEl.textContent = data.mobile || "Not set";
    noteDisplay.textContent = data.note || "No notes yet.";
  });

  // create doc if not exists
  const snap = await getDoc(farmerRef);
  if (!snap.exists()) {
    await setDoc(farmerRef, {
      mobile: "+91 9876543210",
      available: true,
      createdAt: serverTimestamp()
    });
  }
});
