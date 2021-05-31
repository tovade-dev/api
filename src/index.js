const express = require("express");
const glob = require("glob");
const path = require("path");
const app = express();
const cors = require("cors");
const bodyparser = require("body-parser");
app.use(bodyparser.json());
app.use(cors());
const mainRoute = require("./imp/slash");
app.use("/", mainRoute.router);
const loadFiles = async () => {
  let files = glob.sync("./src/routes/*.js");
  files.forEach((route) => {
    const file = require(`${path.resolve(route)}`);
    app.use(`/v1${file.endpoint}`, file.router);
  });
};
loadFiles();
app.listen(3000, function () {
  console.log("Running on port: 3000");
});
