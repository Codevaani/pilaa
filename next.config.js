/** @type {import('next').NextConfig} */
const nextConfig = {
  typedRoutes: true,
  eslint: {
    ignoreDuringBuilds: true, // ✅ build ke time ESLint ko ignore karega
  },
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
}

module.exports = nextConfig
