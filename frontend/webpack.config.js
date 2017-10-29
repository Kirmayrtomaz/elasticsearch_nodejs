const path = require('path')
module.exports = {
  entry: './dev/js/index.js',
  output: {
    path: __dirname,
    filename: 'res/js/bundle.js'
  },
  module: {
    loaders: [{
      exclude: /node_modules/,
      loader: 'babel',
      query: {
        presets: ['es2015']
      }
    }]
  }
}
