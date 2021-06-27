const { Schema, model } = require("mongoose");

module.exports = model(
  "author",
  new Schema({
    id: String,
    slug: String,
    name: String,
    bio: String,
    link: String,
    quotes: Number,
  })
);
