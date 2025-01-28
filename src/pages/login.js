import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null); // Reset error state
    try {
      // Sign in the user with Firebase
      await signInWithEmailAndPassword(auth, email, password);

      // Fetch user role from the database using email
      const response = await fetch("http://localhost:5000/api/users", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch user role from the database.");
      }

      const users = await response.json();
      console.log(users);
      const dbUser = users.find((user) => user.email === email);
      console.log(dbUser);

      if (dbUser?.role) {
        if (dbUser.role === "admin") {
          router.push("/admin");
        } else if (dbUser.role === "user") {
          router.push("/user");
        } else {
          setError("Invalid role found for the user.");
        }
      } else {
        setError("User role not found in the database.");
      }
    } catch (err) {
      setError(err.message || "Failed to log in. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-5 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
      {error && <p className="text-red-500 text-center">{error}</p>}
      <form onSubmit={handleLogin} className="space-y-4">
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
            required
          />
        </div>
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
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-full mt-4">
          Login
        </button>
      </form>
      <p className="text-center mt-4">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-blue-600">
          Sign Up
        </Link>
      </p>
    </div>
  );
};

export default Login;
