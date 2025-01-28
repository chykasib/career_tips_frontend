// components/AuthState.js
import { useState, useEffect } from "react";
import { auth } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";

const AuthState = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        router.push("/dashboard"); // Redirect to dashboard if user is logged in
      } else {
        setUser(null);
        router.push("/login"); // Redirect to login if not logged in
      }
    });

    return () => unsubscribe();
  }, [router]);

  return user ? (
    <p>Welcome, {user.displayName}</p> // Show user info if logged in
  ) : (
    <p>Loading...</p> // Show loading state if user state is being checked
  );
};

export default AuthState;
