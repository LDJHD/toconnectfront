const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3333'
const parsedBackendUrl = new URL(backendUrl)

/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: parsedBackendUrl.protocol.replace(':', ''),
        hostname: parsedBackendUrl.hostname,
        port: parsedBackendUrl.port || '',
        pathname: '/uploads/**',
      },
    ],
  },
  webpack: (config) => {
    config.optimization.minimize = false
    return config
  },
}

export default nextConfig
