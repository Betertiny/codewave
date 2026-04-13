/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/uploads/**',
      },
    ],
  },
  // 环境变量校验
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  // 编译优化
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // 性能优化
  experimental: {
    optimizePackageImports: ['framer-motion', 'lucide-react'],
  },
}

module.exports = nextConfig
