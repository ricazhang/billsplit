var HtmlWebpackPlugin = require('html-webpack-plugin')
var HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
    template: __dirname + './index.html',
    filename: 'index.html',
    inject: 'body'
});

module.exports = {
    entry: [ './app.js' ],
    module: {
        loaders: [
            {
                test: /\.js$/,
                include: __dirname,
                loaders: 'babel-loader'
            }
        ]
    },
    output: {
        filename: 'app_bundle.js',
        path: __dirname + '/dist'
    },
    plugins: [ HtmlWebpackPluginConfig ]
}