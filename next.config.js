/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  distDir: "docs",
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      process: false,
    };
    return config;
  },
};

module.exports = nextConfig;
