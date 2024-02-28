const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

/** @type {import('webpack').Configuration} */
const config = {
  entry: "./src/index.ts",
  output: {
    filename: "index.js",
    path: path.resolve("./dist"),
  },
  mode: process.env.NODE_ENV || "production",
  devServer: {
    hot: true,
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  devtool: process.env.NODE_ENV == "development" ? "inline-source-map" : undefined,
  module: {
    rules: [
      {
        test: /\.ts$/i,
        loader: "ts-loader",
      },
    ],
  },
  plugins: [new HtmlWebpackPlugin()],
};

module.exports = config;
