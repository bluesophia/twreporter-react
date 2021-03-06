const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');
const config = require('./config')
const fs = require('fs')
const path = require('path');
const webpack = require('webpack');

const isProduction = process.env.NODE_ENV !== 'development'
const webpackDevServerHost = config.webpackDevServerHost
const webpackDevServerPort = config.webpackDevServerPort
const webpackPublicPath = config.webpackPublicPath
const webpackOutputFilename = config.webpackOutputFilename

const webpackAssets =  {
  javascripts: {
    chunks: [],
    main: ''
  },
  stylesheets: []
}

function BundleListPlugin(options) {}

// BundleListPlugin is used to write the paths of files compiled by webpack
// such as javascript files transpiled by babel,
// and scss files handled by sass, postcss and css loader,
// into webpack-assets.json
BundleListPlugin.prototype.apply = function(compiler) {
  compiler.plugin('emit', function(compilation, callback) {
    for (const filename in compilation.assets) {
      if (filename.startsWith('main')) {
        webpackAssets.javascripts.main = `${webpackPublicPath}${filename}`
      } else if (filename.indexOf('-chunk-') > -1) {
        webpackAssets.javascripts.chunks.push(`${webpackPublicPath}${filename}`)
      }
    }

    fs.writeFileSync('./webpack-assets.json', JSON.stringify(webpackAssets))
    callback();
  });
};

const webpackConfig = {
  context: path.resolve(__dirname),
  entry: {
    main: './src/client.js',
  },
  output: {
    chunkFilename: '[name]-chunk-[chunkhash].js',
    filename: webpackOutputFilename,
    path: path.join(__dirname, 'dist'),
    publicPath: webpackPublicPath
  },
  devtool: 'inline-source-map',
  devServer: {
    hot: true,
    host: webpackDevServerHost,
    port: webpackDevServerPort
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.(scss|sass)$/,
        use: isProduction ? ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: isProduction,
                sourceMap: !isProduction,
                importLoaders: 2,
                modules: true,
                // Make sure this setting is equal to settings in .bablerc
                localIdentName: '[name]__[local]___[hash:base64:5]'
              }
            }, {
              loader: 'postcss-loader',
              options: {
                plugins: function (loader) {
                  return [ autoprefixer({ browsers: [ '> 1%' ] }) ]
                }
              }}, 'sass-loader']
        }) : [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              minimize: isProduction,
              sourceMap: !isProduction,
              importLoaders: 2,
              modules: true,
              localIdentName: '[name]__[local]___[hash:base64:5]'
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: function (loader) {
                return [ autoprefixer({ browsers: [ '> 1%' ] }) ]
              }
            }
          },
          'sass-loader'
        ]
      },
      {
        test: /\.css$/,
        use: isProduction ? ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [{
            loader: 'css-loader',
            options: {
              minimize: isProduction,
              sourceMap: !isProduction,
              importLoaders: 1
            }
          }, {
            loader: 'postcss-loader',
            options: {
              plugins: function (loader) {
                return [ autoprefixer({ browsers: [ '> 1%' ] }) ]
              }
            }
          }]
        }) : [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: function (loader) {
                return [ autoprefixer({ browsers: [ '> 1%' ] }) ]
              }
            }
          }
        ]
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'image/svg+xml'
          }
        }]
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        BROWSER: true,
        NODE_ENV: isProduction ? '"production"' : '"development"',
        API_HOST: `"${config.API_HOST || 'localhost'}"`,
        API_PORT: `${config.API_PORT || '8080'}`,
        API_PROTOCOL: `"${config.API_PROTOCOL || 'http'}"`
      },
      __CLIENT__: true,
      __DEVELOPMENT__: !isProduction,
      __DEVTOOLS__: true,  // <-------- DISABLE redux-devtools HERE
      __SERVER__: false
    })
  ]
}


if (isProduction) {
  webpackConfig.plugins.push(
    new BundleListPlugin(),
    // css files from the extract-text-plugin loader
    new ExtractTextPlugin({
      // write css filenames into webpack-assets.json
      filename: function(getPath) {
        const filename = getPath('[chunkhash].[name].css')
        webpackAssets.stylesheets.push(webpackPublicPath + filename)
        fs.writeFileSync('./webpack-assets.json', JSON.stringify(webpackAssets))
        return filename
      },
      disable: false,
      allChunks: true
    }),
    new webpack.optimize.UglifyJsPlugin()
    //   new BundleAnalyzerPlugin()
  )
} else {
  webpackConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin()
  )
}

module.exports = webpackConfig;
