import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      process.env.NEXT_PUBLIC_SUPABASE_DOMAIN as string, // Add your Supabase project domain here
    ],
  },
};

export default nextConfig;
