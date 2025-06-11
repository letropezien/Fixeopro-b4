/** @type {import('next').NextConfig} */
const nextConfig = {
  // Désactiver l'export statique pour permettre les routes dynamiques
  // output: 'export',
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // Activer les images optimisées
  images: {
    domains: ['placeholder.com', 'via.placeholder.com'],
    unoptimized: true,
  },
  
  // Redirections et rewrites
  async rewrites() {
    return [
      {
        source: '/admin',
        destination: '/admin',
      },
      {
        source: '/admin/:path*',
        destination: '/admin/:path*',
      },
      {
        source: '/administration',
        destination: '/admin',
      },
      {
        source: '/administration/:path*',
        destination: '/admin/:path*',
      },
    ]
  },
  
  // Redirections permanentes
  async redirects() {
    return [
      {
        source: '/admin.php',
        destination: '/admin',
        permanent: true,
      },
      {
        source: '/wp-admin',
        destination: '/admin',
        permanent: true,
      },
      {
        source: '/administrator',
        destination: '/admin',
        permanent: true,
      },
    ]
  },
  
  // Headers de sécurité
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ]
  },
}

export default nextConfig
