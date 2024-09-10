import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAuqGd69_FerrI7bitW9WwZ0BA0F7MA2W8",
  authDomain: "curso-e6ca1.firebaseapp.com",
  projectId: "curso-e6ca1",
  storageBucket: "curso-e6ca1.appspot.com",
  messagingSenderId: "666954347579",
  appId: "1:666954347579:web:71e1e49e5cedb8347dd81e",
  measurementId: "G-B3N0MXPMY1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export { db };

