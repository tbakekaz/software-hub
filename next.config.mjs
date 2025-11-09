/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' }
    ],
    // Vercel 支持图片优化，不需要禁用
    // unoptimized: true
  },
  pageExtensions: ['ts', 'tsx', 'mdx'],
  // Vercel 不需要特殊的 webpack 配置
  // webpack: (config, { isServer }) => {
  //   if (!isServer) {
  //     config.resolve.fallback = {
  //       ...config.resolve.fallback,
  //       fs: false,
  //       path: false,
  //       crypto: false,
  //     };
  //   }
  //   return config;
  // },
};

export default nextConfig;




