const path = require('path')

module.exports = {
  context: __dirname,
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, '/public'),
    filename: 'bundle.js'
  },
  devServer: {
    publicPath: '/public/'
  },
  resolve: {
    extensions: ['.js', '.json']
  },
  stats: {
    colors: true,
    reasons: true,
    chunks: true
  },
  plugins: [],
  module: {
    rules: [
    {
      test: /\.js$/,
      loader: 'babel-loader'
    },
    {
      test: /\.scss|.css$/,
      loader: 'style!raw!postcss!sass'
    }]
  }

}