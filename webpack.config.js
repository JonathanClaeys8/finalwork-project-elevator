const path = require("path");

module.exports = {
  entry: {
    index: "./src/javascript/index.js",
    repair: "./src/javascript/components/repair.js",
    stageone: "./src/javascript/components/stageone.js"
  },
  output: {
    path: path.resolve(__dirname, "public/js"),
    filename: "[name].js",
  },
  mode: "development",
};
