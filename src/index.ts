import swaggerJsdoc from "swagger-jsdoc"
import swaggerUi from "swagger-ui-express"
import { version } from "../package.json"
import express from "express"
import { sync } from "glob"
import { resolve } from "path"
const app = express()

const dev = true
const options = {
  swaggerDefinition: {
   openapi: '3.0.0',
    info: {
      title: "Tovade's api",
      version: version,
      description: "An api made by Tovade using typescript"
    },
    servers: ["http://localhost:3000/"],
  },
  apis: dev ? ['./src/routes/*.ts'] : ['./dist/src/routes/*.js'],
};

let swaggerSpecification = swaggerJsdoc(options);

app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerSpecification))
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecification))

const loadFiles = async () => {
let files = sync("./src/routes/*.js")
if(!files.length) files = sync("./dist/src/routes/*.js")
files.forEach(route => {
  const file = require(resolve(route))
  app.use(file.default.endpoint, file.default.router)
})
}
loadFiles()
app.listen(3000)