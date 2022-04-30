
const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const isDev = process.env.NODE_ENV === 'development';

module.exports = {
    context: path.resolve(__dirname, "src"),
    mode: "development",
    entry: {
        main: "./js/index.js"
        //тут можно добавлять стороние файлы, которые не относятся к основному файлу JS,
    },
    output: {
        filename: "[name].[contenthash].js",
        path: path.resolve(__dirname, "dist")
    },
    resolve: {
        extensions: ['.js', '.json', '.css', '.scss', '.png', '.jpg', '.svg', '.gif', '.ejs'],
        alias: {
            "@": path.resolve(__dirname, 'src')
        }
    },
    devServer: {
        port: 3000,
        watchFiles: './src/*.html'
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, 'src/assets'),
                    to: path.resolve(__dirname, 'dist/assets')
                },
            ],
        }),
        new HTMLWebpackPlugin({
            template: "./index.html",
            filename: "index.html",
            inject: "body"
        }),
        // new HTMLWebpackPlugin({
        //     template: "./cart.html",
        //     filename: "cart.html",
        //     inject: "body"
        // }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: "[name].[contenthash].css"
        })
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hrm: true,
                            reloadAll: true
                        }
                    },
                    "css-loader"
                ]
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/,
                type: 'asset/resource'
            },
            {
                test: /\.(ttf|woff|woff2|eot)$/,
                type: 'asset/resource'
            }
        ]
    }
}