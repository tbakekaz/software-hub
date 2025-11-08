/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' }
    ],
    // Cloudflare Pages 需要禁用图片优化
    unoptimized: true
  },
  pageExtensions: ['ts', 'tsx', 'mdx']
};

export default nextConfig;




