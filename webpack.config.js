const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
module.exports = (env, argv) => {
  const config = {
    entry: {
      zcoil: "./src/index.ts"
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
        use: [
          {
            loader: 'babel-loader',
            options: {
              plugins: ['lodash']
            }
          }, {
            loader: 'ts-loader'
          }],
        exclude: /node_modules/,
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
      globalObject: 'this',
      libraryTarget: 'umd',
      library: "zcoil",
      filename: "[name].js",
      libraryExport: 'default'
    },
    plugins: [
      new LodashModuleReplacementPlugin,
    ]
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