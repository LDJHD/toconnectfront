import TerserPlugin from 'terser-webpack-plugin';

/** @type {import('next').NextConfig} */
const nextConfig = {
    trailingSlash: true,
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
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.optimization.minimizer = config.optimization.minimizer.map(
                (plugin) => {
                    if (plugin.constructor.name === 'TerserPlugin' || plugin.constructor.name === 'SwcMinifyWebpackPlugin') {
                        return new TerserPlugin({
                            terserOptions: {
                                compress: true,
                                mangle: true,
                                output: {
                                    ascii_only: true,
                                },
                            },
                        });
                    }
                    return plugin;
                }
            );
        }
        return config;
    },
};

export default nextConfig;
