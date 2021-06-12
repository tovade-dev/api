const { Router } = require("express");

const route = Router();
const { fetchAnimal } = require("../utils/functions");
/**
 * @swagger
 * /v1/animal/dog:
 *   get:
 *     description: Returns a random dog image and fact.
 *     tags: [animal]
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Error
 */
route.get("/dog", async (req, res) => {
  const d = await fetchAnimal("dog");

  return res.json(d);
});
/**
 * @swagger
 * /v1/animal/cat:
 *   get:
 *     description: Returns a random cat image and fact.
 *     tags: [animal]
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Error
 */
route.get("/cat", async (req, res) => {
  const e = await fetchAnimal("cat");

  return res.json(e);
});
/**
 * @swagger
 * /v1/animal/panda:
 *   get:
 *     description: Returns a random panda image and fact.
 *     tags: [animal]
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Error
 */
route.get("/panda", async (req, res) => {
  const e = await fetchAnimal("panda");

  return res.json(e);
});
/**
 * @swagger
 * /v1/animal/fox:
 *   get:
 *     description: Returns a random fox image and fact.
 *     tags: [animal]
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Error
 */
route.get("/fox", async (req, res) => {
  const e = await fetchAnimal("fox");

  return res.json(e);
});
/**
 * @swagger
 * /v1/animal/koala:
 *   get:
 *     description: Returns a random koala image and fact.
 *     tags: [animal]
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Error
 */
route.get("/koala", async (req, res) => {
  const e = await fetchAnimal("koala");

  return res.json(e);
});
/**
 * @swagger
 * /v1/animal/birb:
 *   get:
 *     description: Returns a random birb image and fact.
 *     tags: [animal]
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Error
 */
route.get("/birb", async (req, res) => {
  const e = await fetchAnimal("birb");

  return res.json(e);
});

module.exports = {
  endpoint: "/animal",
  router: route,
};
