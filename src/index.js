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
app.get("/", (req, res) => {
  res.redirect("/docs");
});

loadFiles();
app.listen(config.port, function () {
  console.log(`Running on port: ${config.port}`);
});
