// js/firebase.js
// Replace the placeholder values below with your Firebase project config
// (from Project Settings -> SDK setup and configuration)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// This file expects the compat CDN SDKs to be included in the page
if (typeof firebase !== 'undefined') {
  try {
    firebase.initializeApp(firebaseConfig);

    // Common services (compat API)
    const auth = firebase.auth();
    const firestore = firebase.firestore();
    const storage = firebase.storage();

    // Expose short handles globally so existing scripts can use them
    window.firebaseAuth = auth;
    window.firebaseDB = firestore;
    window.firebaseStorage = storage;
  } catch (err) {
    console.error('Failed to initialize Firebase:', err);
  }
} else {
  console.warn('Firebase SDK not loaded. Include Firebase CDN scripts in index.html before js/firebase.js');
}