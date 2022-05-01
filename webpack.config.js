
const webpack = require('webpack');
const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetPlugin = require("optimize-css-assets-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");

const isDev = process.env.NODE_ENV === "development";
const isProd = !isDev;

// const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`;

const optimization = () => {
    const config = {
        splitChunks: {
            chunks: 'all'
        }
    }

    if (isProd) {
        config.minimizer = [
            new OptimizeCssAssetPlugin(),
            new TerserWebpackPlugin()
        ]
    }

    return config;
}

const cssLoaders = (extra) => {
    const loaders = [
        {
            loader: MiniCssExtractPlugin.loader
        },
        "css-loader",
        {
            loader: 'postcss-loader',
            options: {
                postcssOptions: {
                    config: path.resolve(__dirname, 'postcss.config.js'),
                }
            },
        }
    ];

    if (extra) {
        loaders.push(extra);
    }

    return loaders;
}

module.exports = {
    target: process.env.NODE_ENV === "development" ? "web" : "browserslist",
    context: path.resolve(__dirname, "src"),
    mode: "development",
    entry: {
        main: ["@babel/polyfill", "./js/index.js"]
        //тут можно добавлять стороние файлы, которые не относятся к основному файлу JS,
    },
    output: {
        filename: `[name].js`,
        path: path.resolve(__dirname, "dist"),
        // assetModuleFilename: 'assets/images/[name][ext]'
    },
    resolve: {
        extensions: ['.js', '.json', '.css', '.scss', '.png', '.jpg', '.svg', '.gif', '.ejs'],
        alias: {
            "@": path.resolve(__dirname, "src")
        }
    },
    optimization: optimization(),
    devServer: {
        port: 3000,
        hot: isDev,
        watchFiles: "./src/*.html"
    },
    devtool: isDev ? "source-map" : false,
    plugins: [
        new webpack.LoaderOptionsPlugin ({
            hashFilenames: true
        }),
        // new CopyWebpackPlugin({
        //     patterns: [
        //         {
        //             from: path.resolve(__dirname, "src/assets"),
        //             to: path.resolve(__dirname, "dist/assets")
        //         },
        //     ],
        // }),
        new HTMLWebpackPlugin({
            template: "./index.html",
            filename: "index.html",
            inject: "body",
            minify: {
                collapseWhitespace: isProd
            }
        }),
        // new HTMLWebpackPlugin({
        //     template: "",
        //     filename: "",
        //     inject: "body"
        // }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: `[name].css`
        }),
    ],
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: cssLoaders()
            },
            {
                test: /\.s[ac]ss$/i,
                use: cssLoaders("sass-loader")
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/,
                type: "asset/resource"
            },
            {
                test: /\.(ttf|woff|woff2|eot)$/,
                type: "asset/resource"
            },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"],
                        plugins: ["@babel/plugin-proposal-class-properties"]
                    }
                }
            }
        ]
    }
}