const mongo = require("mongoose");
module.exports = mongo.model(
  "users",
  new mongo.Schema({
    id: { type: String },
    key: { type: String },
    ratelimit: {
      max: { type: Number, default: 300 },
      used: { type: Number, default: 0 },
    },
    stats: {
      total: { type: Number, default: 0 },
    },
  })
);
