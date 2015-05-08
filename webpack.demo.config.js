module.exports = {
  entry: ['./demo/demo.jsx'],
  output: {
    path: './demo',
    filename: 'demo.js'
  },
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader?optional=runtime'},
      { test: /\.jsx$/, exclude: /node_modules/, loader: 'babel-loader?optional=runtime'},
      { test: /\.css$/, loader: 'style!css' }
    ]
  }
}
