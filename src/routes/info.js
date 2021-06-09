const { Router } = require("express");
const route = Router();
const fetch = require("node-fetch");


/**
 * @swagger
 * /v1/info/covid:
 *   get:
 *     description: Covid statistics
 *     tags: [info]
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Error
 */
route.get("/covid", async (req, res) => {
  const rese = await fetch("https://disease.sh/v3/covid-19/all").then((reses) =>
    reses.json()
  );

  return res.json(rese);
});

/**
 * @swagger
 * /v1/info/npm:
 *   get:
 *     description: fetch NPM data
 *     tags: [info]
 *     parameters:
 *       - name: package
 *         description: The package name.
 *         in: query
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Error
 */
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

/**
 * @swagger
 * /v1/info/reddit:
 *   get:
 *     description: fetch NPM data
 *     tags: [info]
 *     parameters:
 *       - name: sub
 *         description: Name of subreddit.
 *         in: query
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Error
 */
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
