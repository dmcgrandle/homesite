const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/start.ts',
  target: 'node',
  node: {
    __dirname: false
  },
  externals: [nodeExternals()],
  devtool: 'inline-source-map',
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader'
      }
    ]
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns: [
      '**/*', '!protected', '!protected/**/*', '!public', '!public/**/*'
    ] }),
    new CopyPlugin([
      { from: 'file-type-description.txt', to: '.' },
      { from: 'default-users.json', to: '.' },
      // { from: 'src/protected', to: 'protected' },
      { from: 'src/keys/README.md', to: 'config' },
    ], { copyUnmodified: true }),
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  output: {
    filename: 'server.js',
    chunkFilename: 'config/key.[id].js',
    path: path.resolve(__dirname, 'dist'),
    devtoolModuleFilenameTemplate: '[absolute-resource-path]'
  }
};
