/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "uploadthing.com",
      "lh3.googleusercontent.com",
      "www.greekmythology.com",
    ],
  },
  experimental: {
    appDir: true,
  },
};

module.exports = nextConfig;
