module.exports = {
  entry: ['./lib/index.js'],
  output: {
    path: './dist',
    filename: 'react-flex-layout.js',
    library: 'react-flex-layout',
    libraryTarget: 'commonjs2'
  },
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader?optional=runtime'},
      { test: /\.jsx$/, exclude: /node_modules/, loader: 'babel-loader?optional=runtime'},
      { test: /\.css$/, loader: 'style!css' }
    ]
  },
  externals: {
    react: true
  }
}
