import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",

  // Make R2 credentials available to server actions at runtime
  env: {
    R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID ?? "",
    R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY ?? "",
    R2_ACCOUNT_ID: process.env.R2_ACCOUNT_ID ?? "",
    R2_BUCKET_NAME: process.env.R2_BUCKET_NAME ?? "",
    R2_ENDPOINT: process.env.R2_ENDPOINT ?? "",
    // Server-side alias — NEXT_PUBLIC_ vars are baked in at build time
    // and may not be present inside server actions in production builds.
    R2_PUBLIC_URL:
      process.env.NEXT_PUBLIC_R2_PUBLIC_URL ??
      process.env.R2_PUBLIC_URL ??
      "",
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.r2.dev",
      },
      {
        protocol: "https",
        hostname: "pub-c2b9bf1347d54edea5a8ce0a276516f9.r2.dev",
      },
    ],
  },
};

export default nextConfig;
