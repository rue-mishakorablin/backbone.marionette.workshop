var path = require('path');
var webpack = require('webpack');
var outputPath = path.join(__dirname, '/public');
var basePath = path.join(__dirname, '/javascript');

module.exports = {
    context: basePath,
    entry: {
        main: 'app.js'
    },

    output: {
        path: outputPath,
        filename: '[name].js',
        chunkFilename: '[id]_chunk.js',
        sourceMapFilename: '[file].map'
    },

    resolve: {
        root: [
            basePath,
            path.join(basePath, 'javascripts'),
            path.join(basePath, '../views')
        ],
        modulesDirectories: ['node_modules'],
        alias: {
            marionette: 'backbone.marionette',
        },
        extensions: ['', '.js', '.handlebars']
    },

    module: {
        preLoaders: [
            { test: /\.js$/, loader: 'source-map-loader' }
        ],
        loaders: [
            { test: /^templates\/|\.handlebars$/, loader: 'handlebars-loader', query: { helperDirs: [ path.join(__dirname, 'templates/helpers') ] } },
            { test: /\.js$/, loader: 'babel', exclude: /(node_modules)/, query: { presets: [ require.resolve('babel-preset-es2015') ] }  },
        ]
    },

    plugins: [
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.ProvidePlugin({
            '_': 'underscore',
            Promise: 'bluebird',
        })
    ]
};
