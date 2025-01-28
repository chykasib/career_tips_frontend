// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA0P9vYbkJRPT09aCDjYOMJG_fsB-HabrU",
  authDomain: "career-tips-9d025.firebaseapp.com",
  projectId: "career-tips-9d025",
  storageBucket: "career-tips-9d025.firebasestorage.app",
  messagingSenderId: "297152184232",
  appId: "1:297152184232:web:8903f41d8d71d8df59679d",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

// Assign role (default to 'user')
export const assignUserRole = async (user) => {
  const userRef = doc(db, "users", user.uid);
  await setDoc(userRef, {
    role: "user", // Assign role to user (you can change this to 'admin' when required)
  });
};

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();

export { auth, db, googleProvider };
