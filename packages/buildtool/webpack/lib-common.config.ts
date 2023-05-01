import { Configuration } from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

export default {
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
  ],
  output: {
    assetModuleFilename: '[name][ext]'
  }
} as Configuration;