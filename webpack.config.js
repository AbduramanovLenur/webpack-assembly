const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetPlugin = require("optimize-css-assets-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const fs = require('fs');

const isDev = process.env.NODE_ENV === "development";
const isProd = !isDev;

const pluginsCfg = {
    ejs: [
        {
            filePath: path.resolve(__dirname, './src/pages'),
            outputPath: './',
            inject: "body"
        },
    ],
}

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
        {
            loader: "css-loader",
            options: {
                url: false
            }
        },
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

const pages = pluginsCfg.ejs.map(({ filePath, inject, outputPath }) => {
    const files = fs.readdirSync(filePath).filter(item => item.endsWith('.ejs'))
    const instances = new Set()
    files.forEach((name) => {
        const _filePath = path.resolve(__dirname, `${filePath}/${name.split('.')[0]}.${name.split('.')[1]}`)
        const instance = new HTMLWebpackPlugin({
            filename: `${outputPath}/${name.split('.')[0]}.html`,
            template: `!!ejs-compiled-loader!${_filePath}`,
            id: name,
            inject
        })
        instances.add(instance)
    })
    return [...instances]
}).flat()

module.exports = {
    target: process.env.NODE_ENV === "development" ? "web" : "browserslist",
    context: path.resolve(__dirname, "src"),
    mode: "development",
    // entry: {
        // main: ["@babel/polyfill", "./js/index.js"]
        //тут можно добавлять стороние файлы, которые не относятся к основному файлу JS,
    // },
    entry: './js/index.js',
    output: {
        filename: `[name].js`,
        path: path.resolve(__dirname, "dist")
    },
    resolve: {
        extensions: ['.js', '.json', '.css', '.pcss', '.scss', '.png', '.jpg', '.svg', '.gif', '.ejs'],
        alias: {
            "@": path.resolve(__dirname, "src")
        }
    },
    optimization: optimization(),
    devServer: {
        port: 3000,
        hot: isDev,
        watchFiles: './src/**/*.ejs',
    },
    devtool: isDev ? "source-map" : false,
    plugins: [
        ...pages,
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, "src/assets"),
                    to: path.resolve(__dirname, "dist/assets")
                },
            ],
        }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: `[name].css`
        }),
    ],
    module: {
        rules: [
            {
                test: /\.ejs$/,
                use: ['ejs-compiled-loader']
            },
            {
                test: /\.(pcss|css)$/i,
                use: cssLoaders(),
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg)($|\?)|\.woff($|\?)|\.woff2($|\?)|\.ttf($|\?)|\.eot($|\?)/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[path][name].[ext]'
                    }
                }],
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