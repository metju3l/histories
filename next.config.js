const withNextCircularDeps = require('next-circular-dependency');
const withPlugins = require('next-compose-plugins');

const nextConfig = {
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
};

const plugins = [
  [
    withNextCircularDeps,
    {
      exclude: /node_modules/,
      failOnError: false,
    },
  ],
];

module.exports = withPlugins(plugins, nextConfig);
