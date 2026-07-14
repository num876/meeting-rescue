import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDI4amWPk7JO921Dr2gU7XJrS7johFa9Yk",
  authDomain: "meeting-rescue.firebaseapp.com",
  projectId: "meeting-rescue",
  storageBucket: "meeting-rescue.firebasestorage.app",
  messagingSenderId: "500907091617",
  appId: "1:500907091617:web:8db0b7b2e03e0225b4f2e0",
  measurementId: "G-M6ZP388TED"
};

// Initialize Firebase safely for Next.js SSR
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export const googleProvider = new GoogleAuthProvider();
