const path = require('path');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const CopyPlugin = require('copy-webpack-plugin');

const srcPath = path.resolve(__dirname, './src');
const outputPath = path.resolve(__dirname, 'build');
const imgPath = path.resolve(srcPath, 'images');

module.exports = () => {
  return {
    entry: ['./src/style.less'],
    output: {
      path: outputPath,
      filename: 'index.js',
    },
    devtool: 'inline-source-map',
    devServer: {
      contentBase: outputPath,
      writeToDisk: true
    },
    module: {
      rules: [
        {
          test: /\.(png|jpe?g|gif|ttf|woff2|eot|woff|svg)$/i,
          use: [
            {
              loader: 'file-loader',
              options: {
                esModule: false,
                name: '[name].[ext]',
                outputPath: 'images'
              },
            },
            {
              loader: 'image-webpack-loader',
              options: {
                mozjpeg: {
                  progressive: true,
                  quality: 65
                },
                // optipng.enabled: false will disable optipng
                optipng: {
                  enabled: false,
                },
                pngquant: {
                  quality: [0.65, 0.90],
                  speed: 4
                },
                gifsicle: {
                  interlaced: false,
                },
                // the webp option will enable WEBP
                webp: {
                  quality: 75
                }
              }
            }
          ]
        },
        {
          test: /\.svg$/i,
          //test: /(images).*\.svg$/i,
          include: path.resolve(__dirname, './src', 'images'),
          use: [{
              loader: 'svg-sprite-loader',
              options: {
                //extract: true,
                spriteFilename: 'icon-sprite.svg',
                //outputPath: './sprite'
              }
            },
            {
              loader: 'svg-transform-loader'
            },
            {
              loader: 'svgo-loader',
              options: {
                plugins: [{
                    removeTitle: true
                  },
                  {
                    convertColors: {
                      shorthex: false
                    }
                  },
                  {
                    convertPathData: false
                  }
                ]
              }
            }
          ],
        },
        {
          test: /\.less$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader'],
        },
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
        {
          test: /\.hbs$/,
          loader: 'handlebars-loader'
        }
      ]
    },
    plugins: [
      new CleanWebpackPlugin(),
      new CopyPlugin({
        patterns: [{
          from: imgPath,
          to: path.resolve(outputPath, 'images')
        }, {
          from: './src/index.html',
          to: outputPath
        }, ],
        options: {
          concurrency: 100,
        },
      }),
      new SpriteLoaderPlugin({
        plainSprite: true
      }),
      new MiniCssExtractPlugin({
        filename: 'style.css',
        ignoreOrder: false,
      })
    ]
  };
};
