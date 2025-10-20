import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: "/mostage-editor",
  assetPrefix: "/mostage-editor",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
