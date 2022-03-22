const isProd = process.env.NODE_ENV === 'production'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  assetPrefix: isProd ? '/proj3rd.github.io/' : '',
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      process: false,
    };
    return config;
  },
};

module.exports = nextConfig;
