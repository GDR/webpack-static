const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');

const srcPath = path.resolve(__dirname, "src");
const distPath = path.resolve(__dirname, "dist");

module.exports = {
    entry: {
        vendor: path.join(srcPath, 'scripts/vendor.js'),
        app: path.join(srcPath, 'app.js'),
    },
    output: {
        path: distPath,
        filename: '[name].[chunkhash].js',
        chunkFilename: '[name].[chunkhash].js',
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    //resolve-url-loader may be chained before sass-loader if necessary
                    use: ['css-loader', 'resolve-url-loader', 'sass-loader?sourceMap']
                })
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use:
                    {
                        loader: 'babel-loader',
                        options:
                            {
                                presets: ['env']
                            }
                    }
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(distPath),
        new HtmlWebpackPlugin({
            template: path.join(srcPath, "index.ejs")
        }),
        new ExtractTextPlugin("styles/[name].[chunkhash].css", {allChunks: true}),
        new webpack.optimize.CommonsChunkPlugin({
            names: ["vendor", "app"],

            // filename: "vendor.js"
            // (Give the chunk a different name)
            children: true,
            minChunks: Infinity,
            // (with more entries, this ensures that no other module
            //  goes into the vendor chunk)
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            Tether: 'tether'
        })
    ],
    resolve:
        {
            extensions: ['.js', '.ejs']
        }
    ,
    target: 'web',
    devServer:
        {
            contentBase: path.join(__dirname, "dist"),
            compress:
                true,
            port:
                9000
        }
}
;