import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'standalone', // Required for VPS deployment with PM2
  
  // Image optimization
  images: {
    unoptimized: false,
    formats: ['image/webp', 'image/avif'],
    domains: [
      'your-directus-instance.com',
      'cdn.directus.io',
    ],
  },

  // Headers for security
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // Redirects
  async redirects() {
    return [
      {
        source: '/монгол-хэрэглэгчдэд-зориулсан-үйлчилгээ',
        destination: '/services',
        permanent: true,
      },
    ];
  },

  // Custom webpack config for optimization
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            vendor: {
              filename: 'chunks/vendor.js',
              test: /node_modules/,
              name: 'vendors',
              priority: 10,
            },
          },
        },
      };
    }
    return config;
  },
};

export default nextConfig;
