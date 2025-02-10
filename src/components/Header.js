import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/router";
import Link from "next/link";
import { auth } from "../../firebaseConfig";

const Header = () => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  // Close mobile menu when route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [router.pathname]);

  // Check user authentication and fetch role
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        // Fetch user role from the database
        const response = await fetch("http://localhost:5000/api/users", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          console.error("Failed to fetch user role");
          return;
        }

        const users = await response.json();
        const dbUser = users.find((user) => user.email === currentUser.email);
        setRole(dbUser ? dbUser.role : null);
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
      await signOut(auth);
      router.push("/");
    } catch (err) {
      console.error("Error signing out: ", err);
    }
  };

  return (
    <header className="bg-gradient-to-r from-blue-500 to-teal-500 text-white p-4 shadow-md sticky top-0 z-20">
      <nav className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-3xl font-bold">
          <Link href="/">Career Tips</Link>
        </h1>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden text-white focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✖" : "☰"}
        </button>

        {/* Desktop Menu */}
        <ul className="hidden lg:flex gap-6 text-lg">
          <li>
            <Link href="/" className="hover:text-gray-200">
              Home
            </Link>
          </li>
          {user ? (
            <>
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
                      Dashboard
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
                <span
                  onClick={handleLogout}
                  className="cursor-pointer hover:text-gray-200"
                >
                  Logout
                </span>
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

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="lg:hidden bg-blue-500 text-white mt-4 p-4 rounded-md shadow-lg absolute w-full left-0 top-16">
          <ul className="space-y-4 text-center">
            <li>
              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className="block"
              >
                Home
              </Link>
            </li>
            {user ? (
              <>
                {role === "admin" ? (
                  <>
                    <li>
                      <Link
                        href="/admin"
                        onClick={() => setMenuOpen(false)}
                        className="block"
                      >
                        Admin Panel
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/manage-content"
                        onClick={() => setMenuOpen(false)}
                        className="block"
                      >
                        Manage Content
                      </Link>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link
                        href="/user"
                        onClick={() => setMenuOpen(false)}
                        className="block"
                      >
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/career-tools"
                        onClick={() => setMenuOpen(false)}
                        className="block"
                      >
                        Career Tools
                      </Link>
                    </li>
                  </>
                )}
                <li>
                  <span
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}
                    className="cursor-pointer block"
                  >
                    Logout
                  </span>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="block"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    href="/signup"
                    onClick={() => setMenuOpen(false)}
                    className="block"
                  >
                    Sign Up
                  </Link>
                </li>
              </>
            )}
            <li>
              <Link
                href="/blogs"
                onClick={() => setMenuOpen(false)}
                className="block"
              >
                Blogs
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
