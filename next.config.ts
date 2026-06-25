import type { NextConfig } from "next";
import path from "path";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  allowedDevOrigins: isProd
    ? []
    : ["192.168.59.1"],

  images: {
    unoptimized: true,
  },

  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;