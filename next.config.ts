import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // IIS hosts the compiled server from `.next/standalone/server.js`.
  output: "standalone",
  experimental: {
    agentUpgrade: "security",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "apiv3.uneti.edu.vn",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "aiesi2027.uneti.edu.vn",
        pathname: "/**",
      },
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
