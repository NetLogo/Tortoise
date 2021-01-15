const path = require('path');
const webpack = require('webpack');

module.exports = {
  stats: {
    errorDetails: true,
    modules: true,
  },
  // devtool: 'inline-cheap-module-source-map',
  // No devtool by omitting the field will use the eval devtool, which causes error on GraalVM. It's a known bug.
  devtool: false,
  resolve: {
    alias: {
      brazier: 'brazierjs',
    },
    exportsFields: ['exports'],
    modules: [path.resolve(__dirname, 'src/main/coffee'), 'node_modules'],
    extensions: ['.js', '.coffee', '.wasm', '.json'],
    fallback: {
      stream: require.resolve('stream-browserify'),
      util: require.resolve("util/"),
    },
  },
  entry: path.resolve(__dirname, 'src/main/coffee/webpack-bootstrap.js'),
  output: {
    // path: path.resolve(__dirname, 'dist'),
    // filename: 'bootstrap.js',
    path: path.resolve(__dirname, 'target/classes/js'),
    filename: 'tortoise-engine.js',
    pathinfo: true,
  },
  mode: 'development',
  optimization: {
    moduleIds: 'named',
  },
  module: {
    rules: [
      {
        test: /\.coffee$/,
        use: [{ loader: 'coffee-loader' }],
      },
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'], // required for csv-parse
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.NODE_DEBUG': JSON.stringify(process.env.NODE_DEBUG),
      'process.type': JSON.stringify(process.type),
      'process.version': JSON.stringify(process.version),
    })
  ],
};
