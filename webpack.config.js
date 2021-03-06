/**
 * @fileoverview Configs for plugin's bundle file
 * @author Chow Jia Ying <chowjiaying211@gmail.com>
 */
const path = require("path")
const webpack = require("webpack")
const { name, version, author, license } = require("./package.json")

const TerserPlugin = require("terser-webpack-plugin")

function getOutputConfig(isProduction, isCDN, minify) {
  const filename = `${name.replace("tui-", "")}`

  if (!isProduction || isCDN) {
    const config = {
      library: ["toastui", "Editor", "plugin", "fontSizePicker"],
      libraryExport: "default",
      libraryTarget: "umd",
      path: path.resolve(__dirname, "dist/cdn"),
      filename: `${filename}${minify ? ".min" : ""}.js`,
    }

    if (!isProduction) {
      config.publicPath = "dist/cdn"
    }

    return config
  }

  return {
    libraryExport: "default",
    libraryTarget: "commonjs2",
    path: path.resolve(__dirname, "dist"),
    filename: `${filename}.js`,
  }
}

function getOptimizationConfig(isProduction, minify) {
  const minimizer = []

  if (isProduction && minify) {
    minimizer.push(
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: false,
        extractComments: false,
      }),
    )
  }

  return { minimizer }
}

module.exports = (env, argv) => {
  const isProduction = argv.mode === "production"
  const minify = !!argv.minify
  const isCDN = !!argv.cdn
  const config = {
    mode: isProduction ? "production" : "development",
    entry: "./src/index.js",
    output: getOutputConfig(isProduction, isCDN, minify),
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules|dist/,
          loader: "eslint-loader",
          enforce: "pre",
          options: {
            failOnError: isProduction,
          },
        },
        {
          test: /\.js$/,
          exclude: /node_modules|dist/,
          loader: "babel-loader?cacheDirectory",
          options: {
            // rootMode: "upward"
          },
        },
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader"],
        },
      ],
    },
    optimization: getOptimizationConfig(isProduction, minify),
  }

  if (isProduction) {
    config.plugins = [
      new webpack.BannerPlugin(
        [
          "TOAST UI Editor : Font Size Plugin",
          `@version ${version} | ${new Date().toDateString()}`,
          `@author ${author}`,
          `@license ${license}`,
        ].join("\n"),
      ),
    ]
  } else {
    config.devServer = {
      inline: true,
      host: "0.0.0.0",
    }
    config.devtool = "inline-source-map"
  }

  return config
}
