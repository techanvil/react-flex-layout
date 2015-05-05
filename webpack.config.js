module.exports = {
  entry: ['webpack/hot/dev-server?http://localhost:8080', './lib/example.jsx'],
  output: {
    path: './dist',
    filename: 'example.js'
  },
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader?optional=runtime'},
      { test: /\.jsx$/, exclude: /node_modules/, loader: 'babel-loader?optional=runtime'},
      { test: /\.css$/, loader: 'style!css' }
    ]
  },
  devServer: {
    contentBase: './dist',
    hot: true,
    inline: true
  }
};
