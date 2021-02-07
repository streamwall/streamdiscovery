module.exports = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: './src/index.ts',
  // Put your normal webpack config below here
  module: {
    rules: require('./webpack.rules'),
  },
  mode: "development",
  resolve: {
    mainFields: ['main'],
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json']
  },
  devtool: 'source-map-inline',
};