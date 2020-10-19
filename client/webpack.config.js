const HtmlWebPackPlugin = require("html-webpack-plugin");

module.exports = {

  entry: "./src/main.tsx",

  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },

  module: {
    rules: [
      {
        test: /\.html$/,
        use: { loader: "html-loader" }
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader'
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
    ]

  },

  plugins: [
    new HtmlWebPackPlugin({ template: "./src/index.html", filename: "./index.html" })
  ],

  performance: { hints: false },
  watch: false,
  devtool: "source-map"

};
