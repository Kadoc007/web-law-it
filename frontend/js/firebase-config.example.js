// Firebase Configuration Template (Client-side)
// คัดลอกไฟล์นี้เป็น firebase-config.js แล้วใส่ค่าจริง
// Copy this file to firebase-config.js and replace with your actual Firebase config

const firebaseConfig = {
    apiKey: "YOUR_FIREBASE_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Auth
const auth = firebase.auth();

// Export for use in other scripts (global variables)
window.auth = auth;
