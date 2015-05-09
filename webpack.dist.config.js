module.exports = {
  entry: ['./lib/index.js'],
  output: {
    path: './dist',
    filename: 'react-flex-layout.js',
    libraryTarget: 'umd'
  },
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'},
      { test: /\.jsx$/, exclude: /node_modules/, loader: 'babel-loader'},
      { test: /\.css$/, loader: 'style!css' }
    ]
  },
  externals: {
    react: {
      root: 'React',
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'react'
    }
  }
}
