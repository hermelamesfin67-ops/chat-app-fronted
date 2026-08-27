import type { NextConfig } from "next";
import withPWA from "next-pwa";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default withPWA({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/api\.example\.com/,
      handler: "NetworkFirst",
      options: {
        cacheName: "api-cache",
      },
    },
  ],

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
})(nextConfig as any);
