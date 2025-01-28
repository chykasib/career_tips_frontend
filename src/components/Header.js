import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/router";
import Link from "next/link";
import { auth } from "../../firebaseConfig";

const Header = () => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // Store role here
  const router = useRouter();

  // Check user authentication status and fetch role
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        // Fetch user role from the database using email
        const response = await fetch("http://localhost:5000/api/users", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user role from the database.");
        }

        const users = await response.json();
        const dbUser = users.find((user) => user.email === currentUser.email);

        if (dbUser) {
          setRole(dbUser.role); // Set the user's role
        } else {
          setRole(null);
        }
      } else {
        setUser(null);
        setRole(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out
      router.push("/"); // Redirect to homepage
    } catch (err) {
      console.error("Error signing out: ", err);
    }
  };

  return (
    <header className="bg-blue-600 text-white p-4">
      <nav className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">
          <Link href="/">Career Tips</Link>
        </h1>
        <ul className="flex gap-6">
          <li>
            <Link href="/" className="hover:text-gray-200">
              Home
            </Link>
          </li>
          {user ? (
            <>
              {/* Conditional rendering based on role */}
              {role === "admin" ? (
                <>
                  <li>
                    <Link href="/admin" className="hover:text-gray-200">
                      Admin Panel
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/manage-content"
                      className="hover:text-gray-200"
                    >
                      Manage Content
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link href="/user" className="hover:text-gray-200">
                      User Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link href="/career-tools" className="hover:text-gray-200">
                      Career Tools
                    </Link>
                  </li>
                </>
              )}
              <li>
                <button
                  onClick={handleLogout}
                  className="hover:text-gray-200 cursor-pointer"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link href="/login" className="hover:text-gray-200">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-gray-200">
                  Sign Up
                </Link>
              </li>
            </>
          )}
          <li>
            <Link href="/blogs" className="hover:text-gray-200">
              Blogs
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
