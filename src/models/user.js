const { model, Schema } = require("mongoose");

module.exports = model(
  "users",
  new Schema({
    id: { type: String },
    key: { type: String },
    ratelimit: {
      max: { type: Number, default: 500 },
      used: { type: Number, default: 0 },
    },
    stats: {
      total: { type: Number, default: 0 },
    },
  })
);
