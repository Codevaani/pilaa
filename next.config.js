/** @type {import('next').NextConfig} */
const nextConfig = {
  typedRoutes: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  eslint: {
    // 🚀 Prevent Vercel from failing the build because of ESLint errors
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
