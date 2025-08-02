const path = require("path");

module.exports = {
  entry: "./src/javascript/index.js", 
  output: {
    filename: "bundle.js", 
    path: path.resolve(__dirname, 'public/js'),
  },
  mode: "development", 
};
