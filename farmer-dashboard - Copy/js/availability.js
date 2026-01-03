import { auth, db } from "./firebaseConfig.js";
import { doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const toggleBtn = document.getElementById("toggleAvailability");

auth.onAuthStateChanged((user) => {
  if (!user) return;

  let available = true;

  toggleBtn.addEventListener("click", async () => {
    available = !available;
    await updateDoc(doc(db, "farmers", user.uid), {
      available
    });
    alert(`Availability: ${available ? "Available" : "Not Available"}`);
  });
});
