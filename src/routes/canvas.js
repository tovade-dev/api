const { Router } = require("express");
const { loadImage, createCanvas, registerFont } = require("canvas");
const jimp = require("jimp");
const route = Router();

/**
 * @swagger
 * /v1/canvas/magik:
 *   get:
 *     description: Create funny image
 *     tags: [Canvas]
 *     parameters:
 *       - name: image
 *         description: The url of the image.
 *         in: query
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Error
 */
route.get("/magik", async (req, res) => {
  let int = req.query.intensity;
  if (!req.query.image)
    return res.json({ error: true, message: "No image url.", status: 400 });

  if (!int) int = Math.floor(Math.random() * 10);
  const data = await loadImage(req.query.image);
  const canvas = createCanvas(data.width, data.height);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(data, 0, 0);
  const ddata = ctx.getImageData(0, 0, data.width, data.height);
  const temp = ctx.getImageData(0, 0, data.width, data.height);
  const stride = data.width * 4;
  for (let i = 0; i < data.width; i++) {
    for (let j = 0; j < data.height; j++) {
      const xs = Math.round(
        parseInt(int) * Math.sin(2 * Math.PI * 3 * (j / data.height))
      );
      const ys = Math.round(
        parseInt(int) * Math.cos(2 * Math.PI * 3 * (i / data.width))
      );
      const dest = j * stride + i * 4;
      const src = (j + ys) * stride + (i + xs) * 4;
      ddata.data[dest] = temp.data[src];
      ddata.data[dest + 1] = temp.data[src + 1];
      ddata.data[dest + 2] = temp.data[src + 2];
    }
  }
  ctx.putImageData(ddata, 0, 0);
  res.set({ "Content-Type": "image/png" });
  return res.send(canvas.toBuffer());
});

/**
 * @swagger
 * /v1/canvas/brighten:
 *   get:
 *     description: brighten up an image
 *     tags: [Canvas]
 *     parameters:
 *       - name: image
 *         description: The url of the image.
 *         in: query
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Error
 */
route.get("/brighten", async (req, res) => {
  let imgUrl = req.query.image;
  if (!imgUrl)
    return res.json({
      error: true,
      message: "missing image query",
    });
  let img;
  try {
    img = await jimp.read(imgUrl);
  } catch (err) {
    return res.status(400).json({
      error: true,
      message: "Failed to load this image",
    });
  }

  img.brightness(0.5);
  res.set({ "Content-Type": "image/png" });
  res.status(200).send(await img.getBufferAsync("image/png"));
});

/**
 * @swagger
 * /v1/canvas/greyscale:
 *   get:
 *     description: greyscale an image
 *     tags: [Canvas]
 *     parameters:
 *       - name: image
 *         description: The url of the image.
 *         in: query
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Error
 */
route.get("/greyscale", async (req, res) => {
  let imgUrl = req.query.image;
  if (!imgUrl)
    return res.json({
      error: true,
      message: "missing image query",
    });
  let img;
  try {
    img = await jimp.read(imgUrl);
  } catch (err) {
    return res.status(400).json({
      error: true,
      message: "Failed to load this image",
    });
  }

  img.greyscale();
  res.set({ "Content-Type": "image/png" });
  res.status(200).send(await img.getBufferAsync("image/png"));
});

/**
 * @swagger
 * /v1/canvas/circle:
 *   get:
 *     description: circle an image
 *     tags: [Canvas]
 *     parameters:
 *       - name: image
 *         description: The url of the image.
 *         in: query
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Error
 */
route.get("/circle", async (req, res) => {
  let imgUrl = req.query.image;
  if (!imgUrl)
    return res.json({
      error: true,
      message: "missing image query",
    });
  const image = await jimp.read(imgUrl);
  const mask = await jimp.read("./src/assets/circle-mask.png");
  image.resize(512, 512);
  image.mask(mask, 0, 0);
  let raw;
  image.getBuffer(`image/png`, (err, buffer) => {
    raw = buffer;
  });
  res.set({ "Content-Type": "image/png" });
  res.status(200).send(raw);
});

/**
 * @swagger
 * /v1/canvas/blur:
 *   get:
 *     description: blur an image
 *     tags: [Canvas]
 *     parameters:
 *       - name: image
 *         description: The url of the image.
 *         in: query
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Error
 */
route.get("/blur", async (req, res) => {
  let imgUrl = req.query.image;
  if (!imgUrl)
    return res.json({
      error: true,
      message: "missing image query",
    });
  let intensity = req.query.intensity;
  if (!intensity) intensity = 10;
  let img;
  try {
    img = await jimp.read(imgUrl);
  } catch (err) {
    return res.status(400).json({
      error: true,
      message: "Failed to load this image",
    });
  }

  img.blur(parseInt(intensity));
  res.set({ "Content-Type": "image/png" });
  res.status(200).send(await img.getBufferAsync("image/png"));
});

/**
 * @swagger
 * /v1/canvas/invert:
 *   get:
 *     description: invert an image
 *     tags: [Canvas]
 *     parameters:
 *       - name: image
 *         description: The url of the image.
 *         in: query
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Error
 */
route.get("/invert", async (req, res) => {
  let imgUrl = req.query.image;
  if (!imgUrl)
    return res.json({
      error: true,
      message: "missing image query",
    });
  let img;
  try {
    img = await jimp.read(imgUrl);
  } catch (err) {
    return res.json({
      error: true,
      message: "Failed to load this image",
    });
  }

  img.invert();
  res.set({ "Content-Type": "image/png" });
  res.status(200).send(await img.getBufferAsync("image/png"));
});

/**
 * @swagger
 * /v1/canvas/gay:
 *   get:
 *     description: gay an image
 *     tags: [Canvas]
 *     parameters:
 *       - name: image
 *         description: The url of the image.
 *         in: query
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Error
 */
route.get("/gay", async (req, res) => {
  let imgUrl = req.query.image;
  if (!imgUrl)
    return res.json({
      error: true,
      message: "missing image query",
    });
  let bg = await loadImage(`${__dirname}/../assets/gay.png`);
  let img = await loadImage(imgUrl);
  const canvas = createCanvas(480, 480);
  const ctx = canvas.getContext(`2d`);
  ctx.drawImage(img, 0, 0, 480, 480);
  ctx.drawImage(bg, 0, 0, 480, 480);
  res.set({ "Content-Type": "image/png" });
  res.status(200).send(canvas.toBuffer());
});

/**
 * @swagger
 * /v1/canvas/ad:
 *   get:
 *     description: ad an image
 *     tags: [Canvas]
 *     parameters:
 *       - name: image
 *         description: The url of the image.
 *         in: query
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Error
 */
route.get("/ad", async (req, res) => {
  let imgUrl = req.query.image;
  if (!imgUrl)
    return res.json({
      error: true,
      message: "missing image query",
    });
  let bg = await loadImage(`${__dirname}/../assets/ad.png`);
  let img = await loadImage(imgUrl);
  const canvas = createCanvas(550, 474);
  const ctx = canvas.getContext(`2d`);
  ctx.drawImage(img, 150, 75, 230, 230);
  ctx.drawImage(bg, 0, 0, 550, 474);
  res.set({ "Content-Type": "image/png" });
  res.status(200).send(canvas.toBuffer());
});
/**
 * @swagger
 * /v1/canvas/feelings:
 *   get:
 *     description: feel
 *     tags: [Canvas]
 *     parameters:
 *       - name: text
 *         description: The text to place on the image.
 *         in: query
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Error
 */
route.get("/feelings", async (req, res) => {
  let text = req.query.text;
  if (!text)
    return res.json({
      error: true,
      message: "missing text query",
    });
  let bg = await loadImage(`${__dirname}/../assets/img/feelings.png`);

  const canvas = createCanvas(1080, 1204);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(bg, 0, 0, 1080, 1204);
  ctx.font = "28px Impact";
  ctx.fillText(text, 150, 840);
  res.set({ "Content-Type": "image/png" });
  res.status(200).send(canvas.toBuffer());
});
/**
 * @swagger
 * /v1/canvas/dym:
 *   get:
 *     description: did you mean
 *     tags: [Canvas]
 *     parameters:
 *       - name: top
 *         description: The top text to place on the google search
 *         in: query
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Error
 */
route.get("/dym", async (req, res) => {
  let top = req.query.top;
  if (!top)
    return res.json({
      error: true,
      message:
        "missing text query, try reading the docs: https://api.tovade.xyz/docs",
    });
  let bottom = req.query.bottom;
  if (!bottom)
    return res.json({
      error: true,
      message:
        "missing text query, try reading the docs: https://api.tovade.xyz/docs",
    });
  let bg = await loadImage(`${__dirname}/../assets/img/dym.png`);
  const font = registerFont(`${__dirname}/../assets/fonts/ArialBI.ttf`, {
    family: "ArialBI",
  });
  const canvas = createCanvas(1302, 316);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(bg, 0, 0, 1302, 316);
  ctx.font = "35px Arial";
  ctx.fillText(top, 41, 76);
  ctx.font = "35px ArialBI";
  ctx.fillText(bottom, 295, 280);
  res.set({ "Content-Type": "image/png" });
  res.status(200).send(canvas.toBuffer());
});
/**
 * @swagger
 * /v1/canvas/fail:
 *   get:
 *     description: what a fail
 *     tags: [Canvas]
 *     parameters:
 *       - name: image
 *         description: The url of the image.
 *         in: query
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Error
 */
route.get("/fail", async (req, res) => {
  let imgUrl = req.query.image;
  if (!imgUrl)
    return res.json({
      error: true,
      message: "missing image query",
    });
  let img;
  try {
    img = await jimp.read(imgUrl);
    img.resize(620, 410)
  } catch (err) {
    return res.json({
      error: true,
      message: "Failed to load this image",
    });
  }
  const bonk = await jimp.read(`${__dirname}/../assets/img/fail.png`);
  bonk.composite(img, 70, 48 )
  res.set({ "Content-Type": "image/png" });
  res.status(200).send(await bonk.getBufferAsync("image/png"));
});
module.exports = {
  endpoint: "/canvas",
  router: route,
};
