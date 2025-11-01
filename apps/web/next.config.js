/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@event-platform/types'],
  env: {
    API_URL: process.env.API_URL || 'http://localhost:3001/api/v1',
  },
};

module.exports = nextConfig;
