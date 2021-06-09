const express = require("express");
const glob = require("glob");
const path = require("path");
const app = express();
const cors = require("cors");
const bodyparser = require("body-parser");
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

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

const swaggerOptions = {
	swaggerDefinition: {
		info: {
			title: 'API',
			description: 'API'
		},
		servers: ['http://localhost:20238']
	},
	explorer: true,
	apis: [__dirname + '/Routes/*.js']
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);

app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

loadFiles();
app.listen(20238, function () {
  console.log("Running on port: 20238");
});
