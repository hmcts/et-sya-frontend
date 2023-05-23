const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const cssPath = path.resolve(__dirname, '../src/main/views/webpack/css-template.njk');
const jsPath = path.resolve(__dirname, '../src/main/views/webpack/js-template.njk');

const cssWebPackPlugin = new HtmlWebpackPlugin({
  template: cssPath,
  publicPath: '/',
  filename: cssPath.replace('-template', ''),
  inject: true,
});

const jsWebPackPlugin = new HtmlWebpackPlugin({
  template: jsPath,
  publicPath: '/',
  filename: jsPath.replace('-template', ''),
  inject: true,
});

module.exports = {
  plugins: [cssWebPackPlugin, jsWebPackPlugin],
};
