const path = require('path');

//SPEEDUP
module.rules = {
  test: /\.tsx?$/,
  use: [
    {
      loader: 'ts-loader',
      options: {
        transpileOnly: true,
        experimentalWatchApi: true,
      },
    },
  ],
}
/////////

module.exports = {
  mode: "development",
  // devtool: 'source-map',  //sourceMaps are coool but increasing the building process dramatically
  entry: './src/main.ts',
  module: {
    rules: [
      {
        //test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.json'],
  },
  output: {
    publicPath: 'public',
    filename: 'bundle.js',
    path: path.resolve(__dirname, './public'),
  },



  watchOptions: {
    poll: true,
    ignored: /node_modules/
  }

};
