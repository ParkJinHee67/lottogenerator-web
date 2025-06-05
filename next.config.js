/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    // 빌드 시 ESLint 오류 무시 (경고만 표시)
    ignoreDuringBuilds: true,
  },
  typescript: {
    // 빌드 시 TypeScript 오류 무시 (경고만 표시)  
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig 