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
                protocol: 'http',
                hostname: 'localhost',
                port: '3333',
                pathname: '/uploads/**',
            },
        ],
    },
    webpack: (config) => {
        config.optimization.minimize = false;
        return config;
    },
};

export default nextConfig;
