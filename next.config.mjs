/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' }
    ],
    // Cloudflare Pages 需要禁用图片优化
    unoptimized: true
  },
  pageExtensions: ['ts', 'tsx', 'mdx'],
  webpack: (config, { isServer }) => {
    // 为 Edge Runtime 配置 webpack
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    }
    return config;
  },
};

export default nextConfig;




