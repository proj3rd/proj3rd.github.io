const isProd = process.env.NODE_ENV === 'production'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  assetPrefix: isProd ? 'https://cdn.jsdelivr.net/gh/proj3rd/proj3rd.github.io/docs' : '',
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      process: false,
    };
    return config;
  },
};

module.exports = nextConfig;
