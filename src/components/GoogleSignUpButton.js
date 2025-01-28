// components/GoogleSignUpButton.js
import { signInWithPopup } from "firebase/auth";
import { useRouter } from "next/router";
import { auth, googleProvider } from "../../firebaseConfig";

const GoogleSignUpButton = () => {
  const router = useRouter();

  const handleGoogleSignUp = async () => {
    try {
      // Sign in with Google
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log("User signed in: ", user);

      // Redirect to dashboard after successful login
      router.push("/dashboard");
    } catch (error) {
      console.error("Error with Google sign-in: ", error.message);
    }
  };

  return (
    <button onClick={handleGoogleSignUp} className="google-signup-btn">
      Sign up with Google
    </button>
  );
};

export default GoogleSignUpButton;
