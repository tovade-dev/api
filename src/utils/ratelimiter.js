const { request, response } = require("express");
const nokeyuser = new Map();
/**
 * @param {request} req
 * @param {response} res
 */
module.exports = async (req, res, next) => {
  const s = process.s;

  if (
    req.originalUrl.startsWith("/docs") ||
    req.originalUrl == "/" ||
    req.originalUrl == "/favicon.ico"
  )
    return next();

  const key = req.headers.Authorization;

  if (key) {
    const keyData = await s.getKey(key.replace("Bearer", "").trim());
    if (!keyData)
      return res.json({ error: true, message: "An invalid key was givin." });
    keyData.stats.total++;

    if (keyData.ratelimit.used > keyData.ratelimit.max) {
      return res.json({
        error: true,
        message: `You have been ratelimited (${keyData.ratelimit.max}/m), If you want this number higher join our discord server and ask! (https://api.tovade.xyz/discord)`,
      });
    } else {
      let amount = 1;
      keyData.ratelimit.used += amount;
      setTimeout(() => {
        keyData.ratelimit.used -= amount;
      }, 60 * 1000);
    }

    req.keyData = keyData;
  } else {
    let endData = await nokeyuser.get(
      req.headers["x-real-ip"] || req.connection.remoteAddress
    );
    if (!endData) {
      nokeyuser.set(req.headers["x-real-ip"] || req.connection.remoteAddress, {
        max: 100,
        used: 0,
      });
      endData = await nokeyuser.get(
        req.headers["x-real-ip"] || req.connection.remoteAddress
      );
    }

    if (endData.used > endData.max) {
      return res.json({
        error: true,
        message: `You have reached the rate limit. Please join our discord https://api.tovade.xyz/discord to get an api key`,
      });
    } else {
      let amount = 1;
      endData.used += amount;
      setTimeout(() => {
        endData.used -= amount;
      }, 60 * 1000);
    }

    req.endPoints = nokeyuser;
  }

  next();
};
