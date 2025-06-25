import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [new URL("https://elwiki.net/wiki/images/**")],
  },
  serverExternalPackages: ["bun:sqlite"],
};

export default nextConfig;
