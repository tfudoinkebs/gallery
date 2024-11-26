import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "erbcwsiqzlgbqpfgovjt.supabase.co",
      },
    ],
  },
};
export default nextConfig;
