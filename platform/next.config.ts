import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: { root: process.cwd() },
  experimental: { optimizePackageImports: ["motion/react"] },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "upload.wikimedia.org", port: "", pathname: "/wikipedia/commons/thumb/**", search: "" },
    ],
  },
  async headers() {
    return [
      { source: "/fonts/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=31536000" }] },
      { source: "/assets/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=2592000" }] },
    ];
  },
};

export default nextConfig;
