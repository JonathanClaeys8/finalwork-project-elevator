const path = require("path");

module.exports = {
  entry: {
    index: "./src/javascript/index.js",
    repair: "./src/javascript/components/repair.js",
    stageone: "./src/javascript/components/stageone.js",
    stagetwo: "./src/javascript/components/stagetwo.js",
    stagetree: "./src/javascript/components/stagetree.js",
    stagefour: "./src/javascript/components/stagefour.js",
    stagefive: "./src/javascript/components/stagefive.js",
    end: "./src/javascript/components/end.js"
  },
  output: {
    path: path.resolve(__dirname, "public/js"),
    filename: "[name].js",
  },
  mode: "development",
};
