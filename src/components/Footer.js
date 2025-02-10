import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa"; // Importing social media icons

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-500 to-teal-500 text-white py-8">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        {/* Left Section - Text */}
        <p className="text-center md:text-left text-lg font-semibold">
          © 2025 Career Tips. All Rights Reserved.
        </p>

        {/* Social Media Icons */}
        <div className="flex space-x-6 text-2xl">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-200 transition duration-300"
          >
            <FaFacebook />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-200 transition duration-300"
          >
            <FaTwitter />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-200 transition duration-300"
          >
            <FaLinkedin />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-200 transition duration-300"
          >
            <FaInstagram />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
