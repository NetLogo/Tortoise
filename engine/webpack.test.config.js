const path = require("path");
const webpack = require("webpack");

module.exports = {
  target: "node",
  stats: {
    errorDetails: true,
    modules: true,
  },
  // devtool: 'inline-cheap-module-source-map',
  // No devtool by omitting the field will use the eval devtool, which causes error on GraalVM. It's a known bug.
  // devtool: false,
  resolve: {
    alias: {
      brazier: "brazierjs",
      nblas: false,
      nlapack: false,
    },
    exportsFields: ["exports"],
    modules: [path.resolve(__dirname, "src/main/coffee"), "node_modules"],
    extensions: [".ts", ".js", ".wasm", ".coffee", ".json"],
    fallback: {
      stream: require.resolve("stream-browserify"),
      util: require.resolve("util/"),
    },
  },
  entry: path.resolve(__dirname, "test/test.js"),
  output: {
    // path: path.resolve(__dirname, 'dist'),
    // filename: 'bootstrap.js',
    path: path.resolve(__dirname, "target/test/"),
    filename: "[name].js",
    pathinfo: true,
  },
  devServer: {
    contentBase: "./",
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /\.coffee$/,
        use: [{ loader: "coffee-loader" }],
      },
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      // {
      //   test: /\.wasm$/,
      //   use: "wasm-loader",
      // },
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"], // required for csv-parse
    }),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
      "process.env.NODE_DEBUG": JSON.stringify(process.env.NODE_DEBUG),
      "process.type": JSON.stringify(process.type),
      "process.version": JSON.stringify(process.version),
    }),
  ],
  experiments: {
    // asyncWebAssembly: true,
    syncWebAssembly: true,
    topLevelAwait: true,
  },
};
