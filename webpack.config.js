const path = require("path");
const webpack = require("webpack");

module.exports = {
  mode: "development",
  entry: { main: "./src/main.js" },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "public"),
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
        options: { presets: ["@babel/preset-env"] },
      },
      {
        test: /\.scss$/,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader',
        ],
      },
      {
         test: /\.(png|svg|jpg|gif)$/,
         use: [
           'file-loader',
         ],
       },
    ],
  },
  plugins: [
    new webpack.WatchIgnorePlugin([path.join(__dirname, "node_modules")]), // Ignore node_modules so CPU usage with poll watching drops significantly.
  ],
};
