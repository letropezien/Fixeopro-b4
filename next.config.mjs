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
  // Retirons output: export pour éviter les problèmes avec les routes dynamiques
  // output: 'export',
  trailingSlash: true,
  
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
      {
        source: '/admin-panel',
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
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
    ]
  },
}

export default nextConfig
