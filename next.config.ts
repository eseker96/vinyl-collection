import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['@libsql/client'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.archive.org' },
      { protocol: 'https', hostname: 'coverartarchive.org' },
    ],
  },
};

export default nextConfig;
