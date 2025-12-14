/**
 * Firebase Configuration for HR Gadget Zone
 * This file initializes Firebase services
 */

// Wait for Firebase SDK to load
function initFirebase() {
    // Check if Firebase is loaded
    if (typeof firebase === 'undefined') {
        console.error('❌ Firebase SDK not loaded yet. Make sure Firebase scripts are included before this file.');
        // Retry after a short delay
        setTimeout(initFirebase, 100);
        return;
    }

    // Your Firebase configuration
    const firebaseConfig = {
        apiKey: "AIzaSyBu8uATBYrGSLONYIQZhP_i-+wF50mQ",
        authDomain: "hr-gadget-zone.firebaseapp.com",
        projectId: "hr-gadget-zone",
        storageBucket: "hr-gadget-zone.firebasestorage.app",
        messagingSenderId: "1579186444480",
        appId: "1:1579186444480:web:c07fa274ab245e0c13f0ba5",
        measurementId: "G-HKVX8GZTJV"
    };

    // Initialize Firebase
    try {
        firebase.initializeApp(firebaseConfig);

        // Initialize Firestore
        const db = firebase.firestore();

        // Export for use in other files
        window.firebaseDB = db;

        console.log('✅ Firebase initialized successfully!');
    } catch (error) {
        console.error('❌ Firebase initialization error:', error);
    }
}

// Start initialization
initFirebase();