
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; 
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyDJ7LG-BW5xMN-KkYMK4QSkMr22yIuxE6A",
  authDomain: "chating-app-f8120.firebaseapp.com",
  projectId: "chating-app-f8120",
  storageBucket: "chating-app-f8120.appspot.com",
  messagingSenderId: "542042096680",
  appId: "1:542042096680:web:3c78502081b94ed3d7e11d",
  measurementId: "G-4N73ZNSCJ3"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const analytics = getAnalytics(app);
// Create a root reference
export const storage = getStorage();
export const db = getFirestore();