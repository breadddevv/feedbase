import type { NextConfig } from "next";
import createMDX from '@next/mdx'
import remarkGfm from 'remark-gfm'

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.1.70'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.discordapp.com',
      },
      {
        protocol: 'https',
        hostname: 'media2.giphy.com',
      },
    ],
  }
};

export const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm]
  }
})

export default nextConfig;
