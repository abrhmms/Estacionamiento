import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBuMcwIZUge0HjfhD2NVOnpcd4t0CSyxj4",
  authDomain: "smartpark-77dc3.firebaseapp.com",
  projectId: "smartpark-77dc3",
  storageBucket: "smartpark-77dc3.appspot.com",
  messagingSenderId: "403220071391",
  appId: "1:403220071391:web:99425a0d00de8ea21c3a6a",
  measurementId: "G-X4RFW0MHBS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
