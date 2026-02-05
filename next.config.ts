import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ntfzigsouorgqhzjyrgp.supabase.co',
      },
    ],
  },
};

export default nextConfig;
