import { db } from "../js/firebaseConfig.js";
import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/*
  Called when consumer sends message to farmer
*/
window.sendMessage = async (farmerId) => {
  const textarea = document.getElementById(`msg-${farmerId}`);
  const text = textarea.value.trim();

  if (!text) {
    alert("Enter message");
    return;
  }

  try {
    await addDoc(
      collection(db, "farmers", farmerId, "messages"),
      {
        text: text,
        from: "consumer",
        sentAt: serverTimestamp(), // for reference
        createdAt: Date.now()      // 🔥 SAFE ordering
      }
    );

    textarea.value = "";
    alert("Message sent to farmer");
  } catch (err) {
    console.error("Error sending message:", err);
    alert("Failed to send message");
  }
};
