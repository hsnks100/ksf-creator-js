var webpack = require('webpack');
var path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')


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
        // node: {
        //     fs: 'empty'
        // }
    },
    {
        target: 'electron-renderer',
        entry: { 
            gui: './src/gui.ts',
            vendors: ['phaser']

        },
        mode: 'development',
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    use: ['ts-loader']
                },
            ]
        },
        // externals: {
        //     phaser: 'Phaser',
        //     p2: 'p2',
        //     pixi: 'PIXI',
        // },
    }, 
    ];
