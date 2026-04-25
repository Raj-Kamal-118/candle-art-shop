import withBundleAnalyzer from "@next/bundle-analyzer";

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
      {
        protocol: "https",
        hostname: "loremflickr.com",
      },
      // If you use a custom domain for R2, add it here:
      // { protocol: "https", hostname: "images.yourdomain.com" },
    ],
    minimumCacheTTL: 31536000,
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  async headers() {
    return [
      {
        // Apply aggressive caching to all static assets in the public folder
        source:
          "/(.*).(png|jpg|jpeg|gif|webp|avif|ico|svg|woff|woff2|ttf|otf|mp4)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

export default bundleAnalyzer(nextConfig);
