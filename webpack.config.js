var webpack = require('webpack');
var path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');



module.exports = [
    {
        entry: {
            'main': './src/main.ts'
        },
        mode: 'production',

        output: {
            filename: '[name].js',
            path: path.resolve(__dirname, 'dist')
        },
        devtool: 'source-map',
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    use: ['ts-loader']
                }
            ]
        },
        target: "electron-main"
    },
    {
        target: 'electron-renderer',
        entry: { 
            gui: './src/gui.ts'

        },
        output: {
            // publicPath: 'dist/',
            filename: 'gui.js',
            path: path.resolve(__dirname, 'dist')
        },
        resolve: {
            extensions: ['.ts', '.js'],
            alias: {
                pixi1: path.join(__dirname, 'node_modules/phaser/build/custom/pixi.js'),
                phaser: path.join(__dirname, 'node_modules/phaser/build/custom/phaser-split.js'),
                p2: path.join(__dirname, 'node_modules/phaser/build/custom/p2.js'),
                jquery: path.join(__dirname, 'node_modules/jquery/dist/jquery.js'),
            }
        },
        mode: 'development',
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    use: ['ts-loader']
                },
                {
                    test: /\.css$/,
                    loaders: ["style-loader","css-loader"]
                },
                {
                    test: /\.(jpe?g|png|gif)$/i,
                    loader:"file-loader",
                    options:{
                        name:'[name].[ext]',
                        // outputPath:'assets/images/'
                        //the images will be emited to dist/assets/images/ folder
                    }
                },
                {
                    test: /\.(eot|svg|ttf|woff|woff2)$/i,
                    loader:"file-loader",
                    options:{
                        name:'[name].[ext]',
                    }
                },
                { test: /pixi\.js$/, loader: 'expose-loader?PIXI' },
                { test: /phaser-split\.js$/, loader: 'expose-loader?Phaser' },
                { test: /p2\.js$/, loader: 'expose-loader?p2' },
                { test: require.resolve("jquery"), loader: 'expose-loader?$!expose-loader?jQuery' },
            ]
        },
        plugins: [
            new webpack.ProvidePlugin(
                {
                },
                ),
            new TerserWebpackPlugin(),
            new CompressionPlugin({
              test: /\.js(\?.*)?$/i,
            }),
            new HtmlWebpackPlugin({ template: 'index.html', // 빌드 전에 사용되는 템플릿 
                                  filename: 'index.html' // 빌드 후에 생성될 파일명 
            }),
        ]
        // externals: {
        //     phaser: 'Phaser',
        //     p2: 'p2',
        //     pixi: 'PIXI',
        // },
    }, 
    ];
