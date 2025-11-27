import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for optimized Docker builds
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  }
};

export default nextConfig;
