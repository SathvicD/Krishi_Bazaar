import { db } from "../js/firebaseConfig.js";
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const btn = document.getElementById("getLocation");
const farmersList = document.getElementById("farmersList");

/* ---------------- GET USER LOCATION ---------------- */
btn.onclick = () => {
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const userLat = pos.coords.latitude;
      const userLng = pos.coords.longitude;
      loadFarmers(userLat, userLng);
    },
    () => alert("Location permission denied")
  );
};

/* ---------------- LOAD FARMERS ---------------- */
async function loadFarmers(userLat, userLng) {
  farmersList.innerHTML = "";

  const farmersSnapshot = await getDocs(collection(db, "farmers"));

  for (const farmerDoc of farmersSnapshot.docs) {
    const farmer = farmerDoc.data();

    // Skip unavailable farmers or without location
    if (!farmer.available || !farmer.location) continue;

    const distance = calculateDistance(
      userLat,
      userLng,
      farmer.location.latitude,
      farmer.location.longitude
    );

    // Fetch products
    const productsSnap = await getDocs(
      collection(db, "farmers", farmerDoc.id, "products")
    );

    let productsHTML = "";
    productsSnap.forEach((p) => {
      const product = p.data();
      productsHTML += `
        <div class="product">
          • ${product.name || p.id} – ₹${product.price || "N/A"}
        </div>
      `;
    });

    // Farmer note (max 200 chars)
    const noteText = farmer.note ? farmer.note.substring(0, 200) : "No note yet.";
    const noteHTML = `<div class="farmer-note">📢 Note: ${noteText}</div>`;

    // Create farmer card
    const div = document.createElement("div");
    div.className = "farmer-card";
    div.innerHTML = `
      <div class="farmer-name">👨‍🌾 ${farmer.email || "Farmer"}</div>
      <div class="farmer-info">📞 Mobile: ${farmer.mobile || "Not provided"}</div>
      <div class="farmer-info">📍 Distance: ${distance.toFixed(2)} km</div>

      <div class="products-section">
        <div class="products-title">Products:</div>
        ${productsHTML}
      </div>

      ${noteHTML}

      <textarea
        id="msg-${farmerDoc.id}"
        placeholder="Send message to farmer"
        style="width:95%;margin-top:8px;border-radius:6px;padding:6px;"
      ></textarea>

      <button onclick="sendMessage('${farmerDoc.id}')">
        📩 Send Message
      </button>
    `;

    farmersList.appendChild(div);
  }
}

/* ---------------- SEND MESSAGE ---------------- */
window.sendMessage = async (farmerId) => {
  const textarea = document.getElementById(`msg-${farmerId}`);
  const messageText = textarea.value.trim();

  if (!messageText) {
    alert("Please enter a message");
    return;
  }

  await addDoc(
    collection(db, "farmers", farmerId, "messages"),
    {
      text: messageText,
      from: "consumer",
      sentAt: serverTimestamp()
    }
  );

  textarea.value = "";
  alert("Message sent to farmer");
};

/* ---------------- DISTANCE CALCULATION ---------------- */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}
