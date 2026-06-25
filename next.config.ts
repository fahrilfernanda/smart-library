import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  allowedDevOrigins: isProd
    ? []
    : ["192.168.59.1"],

  images: {
    unoptimized: true,
  },
};

export default nextConfig;