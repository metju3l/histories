const withPWA = require('next-pwa');

module.exports = withPWA({
  pwa: {
    dest: 'public',
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
    domains: [
      'avatars.dicebear.com',
      'histories-bucket.s3.amazonaws.com',
      'lh3.googleusercontent.com',
      'histories-bucket.s3.eu-central-1.amazonaws.com',
    ],
  },
});
