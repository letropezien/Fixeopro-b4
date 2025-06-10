/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Configuration pour éviter les erreurs 404 sur les routes admin
  async rewrites() {
    return [
      {
        source: '/administration',
        destination: '/admin',
      },
      {
        source: '/admin.php',
        destination: '/admin',
      },
      {
        source: '/wp-admin',
        destination: '/admin',
      },
    ]
  },
  // Configuration pour les redirections
  async redirects() {
    return [
      {
        source: '/administrator',
        destination: '/admin',
        permanent: true,
      },
    ]
  },
  // Configuration pour les headers de sécurité
  async headers() {
    return [
      {
        source: '/admin/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow',
          },
        ],
      },
    ]
  },
}

export default nextConfig
