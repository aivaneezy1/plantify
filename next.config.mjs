/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "replicate.com",
      },
      {
        protocol: "https",
        hostname: "replicate.delivery",
      },

      {
        protocol: "https",
        hostname: "cdn2.stablediffusionapi.com",
      },

      {
        protocol: "https",
        hostname: "aivaneezy-ai-bucket.s3.eu-north-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "img.clerk.com"
      }
    ],
  },
};

export default nextConfig;
