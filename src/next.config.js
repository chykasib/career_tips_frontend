/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Enable React strict mode
  images: {
    domains: ["localhost"],
  },
  experimental: {
    esmExternals: "loose", // Enable ES Modules for external libraries
  },
};

module.exports = nextConfig;
