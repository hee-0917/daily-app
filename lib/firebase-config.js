// lib/firebase-config.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDYnxRB5fIQWL-7HV9q-Xt_zMwM1yt_QVk",
  authDomain: "daily-f8a7e.firebaseapp.com",
  databaseURL: "https://daily-f8a7e-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "daily-f8a7e",
  storageBucket: "daily-f8a7e.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef1234567890"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { app, db };
