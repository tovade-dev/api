const express = require("express");
const glob = require("glob");
const path = require("path");
const app = express();
const cors = require("cors");
const bodyparser = require("body-parser");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");
const config = require("../config");
app.use(bodyparser.json());
app.use(cors());
const loadFiles = async () => {
  let files = glob.sync("./src/routes/*.js");
  files.forEach((route) => {
    const file = require(`${path.resolve(route)}`);
    app.use(`/v1${file.endpoint}`, file.router);
  });
};
app.use(require("./utils/ratelimiter"));
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "Tovade's api",
      description: "An api made by tovade.",
    },
    servers: config.servers,
  },
  explorer: true,
  apis: [__dirname + "/routes/*.js"],
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);

app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.redirect("/docs");
});
app.get("/discord", (req, res) => {
  res.redirect(config.discord);
});
app.get("/favicon.ico", (req, res) => {
  res.sendFile(path.join(__dirname + "/assets", "tovade-mustang.png"));
});
require("./utils/mongoDB");
const userManager = require("./utils/userManager");
process.s = new userManager();
loadFiles();
app.listen(config.port, function () {
  console.log(`Running on port: ${config.port}`);
});
require("./bot/index");
