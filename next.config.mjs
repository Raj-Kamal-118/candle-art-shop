/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      // Cloudflare R2 public bucket URL (e.g. pub-xxxx.r2.dev)
      {
        protocol: "https",
        hostname: "*.r2.dev",
      },
      // If you use a custom domain for R2, add it here:
      // { protocol: "https", hostname: "images.yourdomain.com" },
    ],
  },
};

export default nextConfig;
