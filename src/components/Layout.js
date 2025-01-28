import Link from "next/link";
import Footer from "./Footer";
import Header from "./Header";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}

      <Header />
      {/* Main Content */}
      <main className="container mx-auto flex-grow p-4">{children}</main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
