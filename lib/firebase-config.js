// lib/firebase-config.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBdBMXXU4dusAOEA5SMZbViODpk8noVEM0",
  authDomain: "daily-f8a7e.firebaseapp.com",
  databaseURL: "https://daily-f8a7e-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "daily-f8a7e",
  storageBucket: "daily-f8a7e.firebasestorage.app",
  messagingSenderId: "9300445015",
  appId: "1:9300445015:web:cf8acc72cf656795a26012"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };
