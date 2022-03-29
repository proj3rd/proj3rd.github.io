const isProd = process.env.NODE_ENV === 'production'

const fallbackWordExtractor = {
  assert: require.resolve('assert'),
  buffer: require.resolve('buffer'),
  events: require.resolve('events'),
  path: require.resolve('path-browserify'),
  process: require.resolve('process/browser'),
  stream: require.resolve('stream-browserify'),
  util: require.resolve('util'),
  zlib: require.resolve('browserify-zlib'),
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  assetPrefix: isProd ? 'https://cdn.jsdelivr.net/gh/proj3rd/proj3rd.github.io/docs' : '',
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      process: false,
      ...fallbackWordExtractor,
    };
    return config;
  },
};

module.exports = nextConfig;
