module.exports = {
  entry: {
    app: "./src/index"
  },
  devtool: 'inline-source-map',
  module: {
    rules: [{
      test: /\.less$/,
      use: [{
        loader: "style-loader" // creates style nodes from JS strings
      }, {
        loader: "css-loader" // translates CSS into CommonJS
      }, {
        loader: "less-loader" // compiles Less to CSS
      }]
    },{
      test: /\.tsx?$/,
      use: 'ts-loader',
      exclude: /node_modules/
      }
    ]
  },
  optimization: {
       splitChunks: {
         name: 'jquery'
       }
   },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  output: {
     filename: "[name].js",
  }
};