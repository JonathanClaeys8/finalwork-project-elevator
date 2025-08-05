const path = require("path");

module.exports = {
  entry: {
    index: "./src/javascript/index.js",
    repair: "./src/javascript/components/repair.js",
  },
  output: {
    path: path.resolve(__dirname, "public/js"),
    filename: "[name].js",
  },
  mode: "development",
};
