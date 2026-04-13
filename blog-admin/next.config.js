/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
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
    optimizePackageImports: ['lucide-react'],
  },
}

module.exports = nextConfig
