var path = require('path');
const webpack = require('webpack')

module.exports = {
 entry: './main.js',

 output: {
   path: path.resolve(__dirname, 'app'),
   filename: 'index2.js'
 },

 module: {
   loaders: [
     {
       test: /\.js$/,
       exclude: /node_modules/,
       loader: 'babel',
       query: {
         presets: ['es2015', 'react', 'stage-2']
       }
     },
     {
        test: /\.scss$/,
        loaders: ["style-loader", "css-loader", "sass-loader"]
      }
   ]
 }
}
