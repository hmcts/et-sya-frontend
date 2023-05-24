const path = require('path');

const CopyWebpackPlugin = require('copy-webpack-plugin');

const root = require.resolve('govuk-frontend');
const sass = path.join(root, '../all.scss');
const javascript = path.join(root, 'all.js');
const components = path.join(root, '../components');
const assets = path.join(root, '../assets');
const images = path.join(assets, 'images');
const fonts = path.join(assets, 'fonts');

const copyGovukTemplateAssets = new CopyWebpackPlugin({
  patterns: [
    { from: images, to: 'assets/images' },
    { from: fonts, to: 'assets/fonts' },
  ],
});

module.exports = {
  paths: { template: root, components, sass, javascript, assets },
  plugins: [copyGovukTemplateAssets],
};
