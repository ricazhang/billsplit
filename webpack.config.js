var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'src/public');
var APP_DIR = path.resolve(__dirname, 'src/');

var config = {
  entry: {
    app: APP_DIR + '/app.jsx',
    vendor: ["react", "react-dom"]
  },
  output: {
    path: APP_DIR,
    filename: '../bundle.js'
  },
  module: {
      loaders: [
          {
            test : /\.jsx?/,
            include : APP_DIR,
            loader : 'babel-loader'
          }
      ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({ name: "vendor",  filename: "../vendor.bundle.js"})
  ]
};

module.exports = config;