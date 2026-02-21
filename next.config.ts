import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL("https://elwiki.net/wiki/images/**")],
  },
  output: "standalone",
};

export default nextConfig;
