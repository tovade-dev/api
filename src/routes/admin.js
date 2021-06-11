const { Router } = require("express");
const router = Router();
const config = require("../../config");
router.use((req, res, next) => {
  if (!req.headers.auth || req.headers.auth != config.adminkey)
    return res.json({ error: true, message: "you are not an admin" });
  else next();
});

router.post("/add", async (req, res) => {
  const userID = req.query.userID;
  if (!userID) return res.json({ error: true, message: "no userID" });

  const amount = parseInt(req.query.amount) || parseInt(req.query.amout);
  if (!amount) return res.json({ error: true, message: "no amount" });

  const users = process.s;
  const userData = await users.getID(userID);
  if (!userData)
    return res.json({ error: true, message: "This user is not registered." });

  userData.ratelimit.max += amount;

  await users.update(userData).catch(() => null);

  res.json(userData);
});

router.post("/register", async (req, res) => {
  const userID = req.query.userID;
  if (!userID) return res.json({ error: true, message: "no userID" });

  const users = process.s;

  let userData = await users.getID(userID);
  if (userData)
    return res.json({
      error: true,
      message:
        "You may not register again. If you are using our API bot, type `api!key` for your apikey",
    });
  userData = await users.create(userID);

  return res.json(userData);
});

router.get("/user/info", async (req, res) => {
  const userID = req.query.userID;

  if (!userID) return res.json({ error: true, message: "no userID" });

  const users = process.s;

  const userData = await users.getID(userID);

  return res.json(userData);
});

module.exports = {
  endpoint: "/admin",
  router: router,
};
