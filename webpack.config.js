const path = require("path");
const webpack = require("webpack");
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var extractPlugin = new ExtractTextPlugin({
    filename: 'main.css'
});

module.exports = {
  mode: "development",
  entry: { main: "./src/main.js" },
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "[name].bundle.js",
    // publicPath: '/dist'
  },
  devServer: {
    contentBase: path.join(__dirname, "public"),
    compress: true,
    port: 3000,
    inline: true,
    hot: true,
    open: true,
    watchContentBase: true,
    watchOptions: {
      aggregateTimeout: 300, // Delay the rebuild after the first change
      poll: 1000, // Poll using interval (in ms, accepts boolean too)
    },
  },
  module: {
    rules: [
      {
        test: /\.js?/,
        loader: "babel-loader",
        exclude: /node_modules/,
        options: { presets: ["babel-preset-env"] },
      },
      {
        test: /\.scss$/,
        use: extractPlugin.extract({
          use: ["css-loader", "sass-loader"],
        }),
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "img/",
              publicPath: "img/",
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.WatchIgnorePlugin([path.join(__dirname, "node_modules")]), // Ignore node_modules so CPU usage with poll watching drops significantly.
    extractPlugin,
  ],
};
