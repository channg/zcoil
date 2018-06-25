const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = (env, argv) => {
  const config = {
    entry: {
      app: "./src/test.ts"
    },
    
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
      }, {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
      ]
    },
    optimization: {
      splitChunks: {}
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js']
    },
    output: {
      filename: "[name].js",
    }
  }
  
  if (argv.mode === 'development') {
    config.devtool = 'inline-source-map'
  } else {
    config.plugins = [
      new UglifyJsPlugin({
        uglifyOptions: {
          compress: {
            warnings: false
          },
          output: {
            comments: false
          }
        }
      })
    ]
  }
  return config
}