const path = require('path');

module.exports = {
    module: {
        rules: [
          {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            loader: "babel-loader",
            options: { presets: ["@babel/preset-env", "@babel/preset-react"] }
          }],
    },
  entry: {index:'./index.js', cities:'./cities.js', details:'./details.js'},  // path to our input file
  output: {
    filename: '[name]-bundle.js',  // output bundle file name
    path: path.resolve(__dirname, './met_django/static'),  // path to our Django static directory
  },
  resolve: {
    alias: {
      react: path.resolve('./node_modules/react')
    }
  }
};

