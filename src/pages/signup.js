import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../../firebaseConfig";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Pass the Firebase UID to the backend
      await fetch("/api/addUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email: user.email,
          role: "user", // Default role
          uid: user.uid, // Pass the UID here
        }),
      });

      router.push("/"); // Redirect after successful signup
    } catch (err) {
      displayFirebaseError(err); // Handle error if signup fails
    }
  };

  const handleGoogleSignUp = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Pass the Firebase UID to the backend
      await fetch("/api/addUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: user.displayName || "User", // Use displayName if available
          email: user.email,
          role: "user", // Default role
          uid: user.uid, // Pass the UID here
        }),
      });

      router.push("/"); // Redirect after successful signup
    } catch (error) {
      displayFirebaseError(error); // Handle error if Google signup fails
    }
  };

  const displayFirebaseError = (error) => {
    switch (error.code) {
      case "auth/email-already-in-use":
        setError("This email is already in use. Please use a different email.");
        break;
      case "auth/invalid-email":
        setError("The email address is invalid. Please enter a valid email.");
        break;
      case "auth/weak-password":
        setError(
          "The password is too weak. Use at least 6 characters with a mix of uppercase, lowercase, numbers, and symbols."
        );
        break;
      case "auth/missing-password":
        setError("Please enter a password.");
        break;
      default:
        setError("An unexpected error occurred. Please try again.");
        console.error("Error code:", error.code, "| Message:", error.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      {/* Logo */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Create an Account</h1>
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-red-500 text-center bg-red-100 p-2 rounded mb-4">
          {error}
        </p>
      )}

      <form onSubmit={handleSignup} className="space-y-4">
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-semibold">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input input-bordered w-full"
            placeholder="Enter your full name"
            required
          />
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-semibold">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input input-bordered w-full"
            placeholder="Enter your email address"
            required
          />
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="password" className="block text-sm font-semibold">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input input-bordered w-full"
            placeholder="Create a strong password"
            required
          />
        </div>

        {/* Signup Button */}
        <button
          type="submit"
          className="btn btn-primary w-full flex items-center justify-center space-x-2 mt-4"
        >
          <i class="fa fa-envelope" aria-hidden="true"></i>
          <span>Sign Up</span>
        </button>
      </form>

      {/* Google Sign-Up */}
      <div className="mt-4">
        <button
          onClick={handleGoogleSignUp}
          className="btn btn-secondary w-full flex items-center justify-center space-x-2 mt-2"
        >
          <i class="fa fa-google" aria-hidden="true"></i>
          <span>Sign Up with Google</span>
        </button>
      </div>

      {/* Redirect to Login */}
      <p className="text-center mt-4">
        Already have an account?{" "}
        <Link href="/login" className="text-blue-600 font-semibold">
          Login
        </Link>
      </p>
    </div>
  );
};

export default Signup;
