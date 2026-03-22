const webpack = require("webpack");

module.exports = function override(config) {
  config.resolve.alias = {
    ...config.resolve.alias,
    buffer: require.resolve("buffer"),
  };

  config.resolve.fallback = {
    crypto: require.resolve("crypto-browserify"),
    stream: require.resolve("stream-browserify"),
    zlib: require.resolve("browserify-zlib"),
    http: require.resolve("stream-http"),
    https: require.resolve("https-browserify"),
    os: require.resolve("os-browserify/browser"),
    process: require.resolve("process/browser.js"),
    buffer: require.resolve("buffer"),
    path: false,
    fs: false,
  };

  config.plugins.push(
    new webpack.ProvidePlugin({
      process: "process/browser.js",
      Buffer: ["buffer", "Buffer"],
    })
  );

  config.module.rules.push({
    test: /\.m?js/,
    resolve: {
      fullySpecified: false,
    },
  });

  return config;
};