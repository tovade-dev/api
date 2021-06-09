const { Router } = require("express");
const route = Router();
const fetch = require("node-fetch");

route.get("/covid", async (req, res) => {
  const rese = await fetch("https://disease.sh/v3/covid-19/all").then((reses) =>
    reses.json()
  );

  return res.json(rese);
});
const { fetchPkg, fetchSub } = require("../utils/functions");
route.get("/npm", async (req, res) => {
  if (!req.query.package)
    return res.json({
      error: true,
      message: "No npm package was provided in the query",
    });
  const data = await fetchPkg(req.query.package);
  return res.json(data);
});
route.get("/reddit", async (req, res) => {
  if (!req.query.sub)
    return res.json({
      error: true,
      message:
        "Missing subreddit! example: https://api.tovade.xyz/v1/info/reddit?sub=discord ",
    });
  const data = await fetchSub(req.query.sub);
  return res.json(data);
});

module.exports = {
  endpoint: "/info",
  router: route,
};
