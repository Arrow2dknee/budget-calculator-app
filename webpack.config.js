const outputFilePath = require('path');
module.exports = {
    entry: ['babel-polyfill', './src/index.js'],
    output: {
        path: outputFilePath.resolve(__dirname, 'public/scripts'),
        filename: 'bundle.js'
    },
    devtool: 'source-map',
    devServer: {
        contentBase: outputFilePath.resolve(__dirname, 'public'),
        publicPath: '/scripts/'
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['env']
                }
            }
        }]
    }
}