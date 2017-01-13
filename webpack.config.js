'use strict';
const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const postcss = require('postcss-loader');
const cssnext = require('postcss-cssnext');
const precss = require('precss');
const autoprefixer = require('autoprefixer');
const file = require('file-loader');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

const DEVELOPMENT = process.env.NODE_ENV == JSON.stringify('development');
const PRODUCTION = process.env.NODE_ENV == JSON.stringify('production');

const baseURL = 'http://localhost:3100';

const entry = PRODUCTION
      ?    [ './app.js']
      :    [ // DEVELOPMENT
            './app.js',
            'webpack/hot/only-dev-server',
            'webpack-dev-server/client?' + baseURL
          ];

const plugins = PRODUCTION
      ?      [ // PRODUCTION
              new webpack.optimize.OccurrenceOrderPlugin(),
              new HtmlWebpackPlugin({ template: './index.html'}),
              new ExtractTextPlugin("assets/[name]-[hash].min.css"),
              new webpack.optimize.UglifyJsPlugin({ compressor: { warnings: false, screw_ie8: true }}),
              new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
              }),
            ]
      :     [ // DEVELOPMENT
              new BrowserSyncPlugin(
                {
                  host: 'localhost',
                  port: 3000,
                  // proxy the Webpack Dev Server endpoint
                  proxy: 'http://localhost:3100/'
                },
                // plugin options
                {
                  // prevent BrowserSync from reloading the page
                  // and let Webpack Dev Server take care of this
                  reload: false
                }
              ),
              // enable HMR globally
              new webpack.HotModuleReplacementPlugin(),
              // prints more readable module names in the browser console on HMR updates
              new webpack.NamedModulesPlugin(),
              new webpack.optimize.OccurrenceOrderPlugin(),
              new webpack.NoErrorsPlugin(),
              new HtmlWebpackPlugin({ template: './index.html'}),
              new ExtractTextPlugin("assets/[name]-[hash].css"),
              new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
              }),
            ];

const config = {
  context: __dirname + '/src',
  entry: {
    app: entry
  },
  output: {
    filename: '[name]-[hash].min.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },
  devServer: {
    // Enable HMR on the server
    hot: true,
    // Match the output path
    contentBase: path.resolve(__dirname, 'dist'),
    // Match the output 'publicPath'
    publicPath: '/'
  },
  devtool: 'cheap-eval-source-map',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: [{
          loader: 'babel-loader',
        }],
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({ notExtractLoader: 'style-loader', loader: 'css-loader?importLoaders=1!postcss-loader?sourceMap=inline' })
      }
    ]
  },
  plugins: plugins
};

module.exports = config;
