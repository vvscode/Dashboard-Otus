import path from "path";
import { fileURLToPath } from "url";
import HtmlWebpackPlugin from "html-webpack-plugin";
import webpack from "webpack";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PREFIX = "/Dashboard-Otus/";

const isLocalRun = process.env.NODE_ENV === "production";

export default {
  mode: "development",

  entry: "./src/controller.js",

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.[fullhash].js",
    publicPath: isLocalRun ? PREFIX : "/",
  },

  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({ template: "./src/dashBoard.html" }),
    new HtmlWebpackPlugin({
      template: "./src/dashBoard.html",
      filename: "404.html",
    }),
    new webpack.DefinePlugin({
      PRODUCTION: JSON.stringify(isLocalRun),
      PREFIX: JSON.stringify(PREFIX),
    }),
  ],

  devServer: {
    static: {
      directory: path.join(__dirname, "public"),
    },

    compress: true,

    port: 9000,

    historyApiFallback: true,

    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
    },
  },
};

//Такая настройка webpack именно для GH Pages нужна? С норм хостингом, где работает history api такой проблемы не будет?
