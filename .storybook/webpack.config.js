const path = require('path');
const SRC_PATH = path.join(__dirname, '**/');
const STORIES_PATH = path.join(__dirname, '**/stories');

module.exports = ({ config }) => {
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    include: [SRC_PATH, STORIES_PATH],
    use: [
      {
        loader: require.resolve('awesome-typescript-loader'),
        options: {
          configFileName: './.storybook/tsconfig.json',
          useCache: true,
        },
      },
      { loader: require.resolve('react-docgen-typescript-loader') },
    ],
  });

  config.module.rules.push({
    test: /\.(tsx|graphql)$/,
    use: [
      {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-typescript', '@babel/preset-react'],
        },
      },
      { loader: 'graphql-let/loader' },
    ],
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

  config.resolve.extensions.push('.ts', '.tsx');

  return config;
};
