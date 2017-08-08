const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const webpack = require('webpack');
const glob = require('glob');
const path = require("path");
const PurifyCSSPlugin = require('purifycss-webpack');


const isDev = process.env.NODE_ENV !== "production";
const bootstrapEntryPoints = require('./webpack.bootstrap.config');


var cssDev = ['style-loader','css-loader?sourseMap','sass-loader'];
var cssProd = ExtractTextPlugin.extract({
    fallback: 'style-loader',
    use: ['css-loader','sass-loader'],
    publicPath: '/dist'
});

var cssConfig = isDev ? cssDev : cssProd;

var bootstrapConfig = isDev ? bootstrapEntryPoints.dev : bootstrapEntryPoints.prod;

module.exports = {

  context: __dirname,
  devtool: isDev ? "inline-sourcemap" : null,
  entry: {
    app: "./src/assets/js/scripts.js",
    bootstrap: bootstrapConfig,
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].min.js"
  },
  plugins: isDev ? [] : [
      new webpack.ProvidePlugin({
      $: "jquery",
      jquery: "jquery",
      "window.jQuery": "jquery",
      jQuery:"jquery",
      
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),

  ],
  module: {
  rules: [  
            //images
            {test: /\.(jpe?g|png|gif|svg)$/i,
                use: [
                  'file-loader?name=images/[name].[ext]',
                  'image-webpack-loader?bypassOnDebug'
                ]
            },
            //fonts
            { test: /\.(woff2?)$/, use: 'url-loader?limit=10000&name=assets/fonts/[name].[ext]' },
            { test: /\.(ttf|eot)$/, use: 'file-loader?name=assets/fonts/[name].[ext]' },
            
            //css
            {test: /\.s?css$/,use: cssConfig},

            // Bootstrap 3
            { test:/bootstrap-sass[\/\\]assets[\/\\]javascripts[\/\\]/, use: 'imports-loader?jQuery=jquery,$=jquery,this=>window' },
            
  ],
},

 devServer: {
        contentBase: path.join(__dirname, "dist"),
        compress: true,
        hot: true,
        open: true,
        stats: 'errors-only'
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'IRIS Test',
            hash: true,
            template: './src/index.html'
        }),
        new ExtractTextPlugin({
            filename: 'src/assets/css/[name].css',
            disable: false,
            allChunks: true
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
        // Make sure this is after ExtractTextPlugin!
        new PurifyCSSPlugin({
            // Give paths to parse for rules. These should be absolute!
            paths: glob.sync(path.join(__dirname, 'src/*.html'))
        })
    ]


};