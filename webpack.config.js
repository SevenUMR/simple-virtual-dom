var webpack = require('webpack');

module.exports = {
    entry: './src/js/example.js', //入口文件
    output: {
        path: __dirname + "/dist",
        filename:'index.js'
    },
    module: {
        rules: [
            { test: /\.json$/, loader: "json" }, 
            { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader', query: { presets: ['env', 'react'] }},
            { test: /\.css$/, loader: 'style-loader!css-loader' }  
        ]
    },
    devServer: {
      contentBase: "./",
      port: '8090',
      historyApiFallback: false,
      inline: true
  }
}
