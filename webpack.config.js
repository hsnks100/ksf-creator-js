var webpack = require('webpack');
var path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = [
    {
        entry: {
            'main': './src/main.ts'
        },
        mode: 'development',

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
            publicPath: 'dist/',
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
                }
            ]
        },
        plugins: [
            new webpack.ProvidePlugin(
                {
                    $: 'jquery',
                    jQuery: 'jquery',
                    'window.jQuery': 'jquery',
                }
                )
        ]
        // externals: {
        //     phaser: 'Phaser',
        //     p2: 'p2',
        //     pixi: 'PIXI',
        // },
    }, 
    ];
