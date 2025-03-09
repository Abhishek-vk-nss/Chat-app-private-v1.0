// Import Firebase Modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";

// Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyD51vU5ECTY_N5ik3KW6uPORjL5oo64xEA",
    authDomain: "chat-master-65f68.firebaseapp.com",
    projectId: "chat-master-65f68",
    storageBucket: "chat-master-65f68.appspot.com",
    messagingSenderId: "266655454652",
    appId: "1:266655454652:web:e2425ad9b0e6a39f0707b9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// DOM Elements
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const messagesDiv = document.getElementById("messages");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");

// Login with Google
loginBtn.addEventListener("click", async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        console.log("✅ User logged in:", result.user);
    } catch (error) {
        console.error("❌ Login Error:", error);
    }
});

// Logout
logoutBtn.addEventListener("click", async () => {
    try {
        await signOut(auth);
        console.log("✅ User logged out");
    } catch (error) {
        console.error("❌ Logout Error:", error);
    }
});

// Check User Authentication & Enable Input
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("✅ User signed in:", user.displayName);
        loginBtn.style.display = "none";
        logoutBtn.style.display = "block";
        
        // Enable typing bar and send button
        messageInput.disabled = false;
        sendBtn.disabled = false;
        
        loadMessages();
    } else {
        console.log("🚫 User signed out");
        loginBtn.style.display = "block";
        logoutBtn.style.display = "none";
        
        // Disable typing bar and send button
        messageInput.disabled = true;
        sendBtn.disabled = true;
    }
});

// Send Message
sendBtn.addEventListener("click", async () => {
    if (messageInput.value.trim() !== "") {
        await addDoc(collection(db, "messages"), {
            text: messageInput.value,
            uid: auth.currentUser.uid,
            name: auth.currentUser.displayName,
            timestamp: new Date()
        });
        messageInput.value = ""; // Clear input after sending
    }
});

// Load Messages in Real-Time
function loadMessages() {
    const q = query(collection(db, "messages"), orderBy("timestamp"));
    onSnapshot(q, (snapshot) => {
        messagesDiv.innerHTML = "";
        snapshot.forEach((doc) => {
            const data = doc.data();
            const messageElement = document.createElement("p");
            messageElement.textContent = `${data.name}: ${data.text}`;
            messagesDiv.appendChild(messageElement);
        });
    });
}
