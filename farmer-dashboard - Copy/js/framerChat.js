import { auth, db } from "./firebaseConfig.js";
import { doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const saveNoteBtn = document.getElementById("saveNote");
const farmerNote = document.getElementById("farmerNote");

auth.onAuthStateChanged((user) => {
  if (!user) return;

  saveNoteBtn.addEventListener("click", async () => {
    const note = farmerNote.value.trim();
    if (!note) return alert("Write something");

    await updateDoc(doc(db, "farmers", user.uid), { note });
    farmerNote.value = "";
    alert("Note saved");
  });
});
