const { Router } = require("express");
const endpointJSON = require("../json/endpoints.json");

const route = Router();

route.get("/", (req, res) => {
  return res.json({
    endpoints: endpointJSON,
  });
});

module.exports = {
  router: route,
};
