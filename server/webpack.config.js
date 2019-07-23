const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
// const CreateSymlinkPlugin = require('create-symlink-webpack-plugin');

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
      '**/*', '!protected', '!protected/**/*'
    ] }),
    new CopyPlugin([
      { from: 'file-type-description.txt', to: '.' },
      { from: 'default-users.json', to: '.' },
      { from: 'src/public', to: 'public' },
      { from: 'src/keys/README.md', to: 'config' },
      // { from: 'src/protected', to: 'protected' },
    ]),
  //   new CreateSymlinkPlugin([
  //     { origin: '../src/public', symlink: 'public' },
  //     { origin: '../src/protected', symlink: 'protected' }
  // ])
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
