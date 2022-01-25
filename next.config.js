const withPWA = require('next-pwa');

module.exports = withPWA({
  pwa: {
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === 'development',
  },
  swcMinify: false,
  optimizeCss: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  webpack(config, options) {
    config.module.rules.push({
      test: /\.graphql$/,
      exclude: /node_modules/,
      use: [options.defaultLoaders.babel, { loader: 'graphql-let/loader' }],
    });

    config.module.rules.push({
      test: /\.graphqls$/,
      exclude: /node_modules/,
      use: ['graphql-let/schema/loader'],
    });

    config.module.rules.push({
      test: /\.ya?ml$/,
      type: 'json',
      use: 'yaml-loader',
    });

    return config;
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    domains: [
      'avatars.dicebear.com',
      'ipfs.io',
      'ipfs.infura.io',
      'images.weserv.nl',
      'localhost',
    ],
  },
});
