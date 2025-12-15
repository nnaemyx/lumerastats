import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  productionBrowserSourceMaps: false,
  // Use webpack explicitly to avoid Turbopack conflict
  webpack: (config, { isServer }) => {
    // Suppress source map warnings
    if (!isServer) {
      config.devtool = false;
    }
    return config;
  },
  // Add empty turbopack config to silence the warning
  turbopack: {},
};

export default nextConfig;
