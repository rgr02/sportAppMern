var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: './src/',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'app.bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                query: {
                    presets: ["react", "es2015", "stage-2"]
                }
            },
            {test: /\.(jpe?g|gif|png|svg|css|json)$/, loader: "file-loader"}
        ]
    },
    stats: {
        colors: true
    },
    devtool: 'source-map'
};