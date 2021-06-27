const quoteAuthor = require("../assets/json/quoteAuthors.json");
const model = require("../models/author");
async function getAuthorById(id, res) {
  const m = await model.findOne({
    id,
  });
  if (!m) return res.json({ error: true, message: "No quote author found. " });
  if (m) {
    return res.json({
      name: m.name,
      bio: m.bio,
      link: m.link,
      quotes: m.quotes,
    });
  }
}
async function getAuthorBySlug(slug, res) {
  const m = await model.findOne({
    slug,
  });
  if (!m) return res.json({ error: true, message: "No quote author found. " });
  if (m) {
    return res.json({
      name: m.name,
      bio: m.bio,
      link: m.link,
      quotes: m.quotes,
    });
  }
}

module.exports = {
  getAuthorById,
  getAuthorBySlug,
};
