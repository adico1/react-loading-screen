const path    = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  entry: [
    'webpack-hot-middleware/client',
    'babel-polyfill',
    './demo/client/index.js'
  ],
  output: {
    path: path.join(__dirname, 'demo'),
    filename: 'demo-bundle.js',
  },
  plugins: [  
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),    
  ],

  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/, 
      use: 'babel-loader'
    }, { 
      test: /\.css$/, 
      use: ["style-loader","css-loader"]
    },
    {
      test: /\.mp3$/,
      use: 'file-loader'
    }]
  }
};
