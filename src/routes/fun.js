const { Router } = require("express");
const cheerio = require("cheerio");
const fetch = require("node-fetch");
const route = Router();
const jokes = require("../assets/json/jokes.json");
const eightball = require("../assets/json/8ball.json");
const { facts } = require("../assets/js/facts");
const quotes = require("../assets/json/quotes.json");
/**
 * @swagger
 * /v1/fun/wyr:
 *   get:
 *     description: Would you rather.
 *     tags: [fun]
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Error
 */
route.get("/wyr", async (req, res) => {
  const data = await fetch("http://either.io").then((resp) => resp.text());
  const $ = cheerio.load(data);

  const wyr = String($('div[class="option"] a').text()).split("\n");
  const votes = [
    Number(
      $(
        'div[class="result result-1"] div[class="total-votes"] span[class="count"]'
      )
        .html()
        .replace(/,+/g, "")
    ),
    Number(
      $(
        'div[class="result result-2"] div[class="total-votes"] span[class="count"]'
      )
        .html()
        .replace(/,+/g, "")
    ),
  ];
  const total_votes = Number(
    $('span[class="contents"]').text().split(" votes")[0].replace(/,+/g, "")
  );
  const percentage = [
    ((votes[0] / total_votes) * 100).toFixed(2),
    ((votes[1] / total_votes) * 100).toFixed(2),
  ];
  const author = $('span[id="question-author"] a').text();

  return res.json({
    questions: [wyr[1].trim(), wyr[2].trim()],
    votes: {
      1: votes[0],
      2: votes[1],
    },
    percentage: {
      1: percentage[0],
      2: percentage[1],
    },
    author: author,
  });
});
/**
 * @swagger
 * /v1/fun/joke:
 *   get:
 *     description: Just getting an joke.
 *     tags: [fun]
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Error
 */
route.get("/joke", (req, res) => {
  const joke = jokes[Math.floor(Math.random() * jokes.length)];

  return res.json({
    question: joke.setup,
    answer: joke.punchline,
    category: joke.type,
  });
});
/**
 * @swagger
 * /v1/fun/reverse:
 *   get:
 *     description: Reverse some text.
 *     tags: [fun]
 *     parameters:
 *       name: content
 *       description: The text to reverse.
 *       in: query
 *       required: true
 *       type: string
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Error
 */
route.get("/reverse", (req, res) => {
  const content = req.query.content;
  if (!content)
    return res.json({
      error: true,
      message: "Provide the content to reverse.",
    });
  if (typeof content !== "string")
    return res.json({
      error: true,
      message: "Make sure the message is a String.",
    });

  const reversed = content.split("").reverse().join(" ");
  return res.json({
    content: reversed,
  });
});
/**
 * @swagger
 * /v1/fun/8ball:
 *   get:
 *     description: Returns a random answer.
 *     tags: [fun]
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Error
 */
route.get("/8ball", (req, res) => {
  return res.json({
    answer: eightball[Math.floor(Math.random() * eightball.length)],
  });
});
/**
 * @swagger
 * /v1/fun/fact:
 *   get:
 *     description: Just getting an fact.
 *     tags: [fun]
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Error
 */
route.get("/fact", (req, res) => {
  const fact = facts[Math.floor(Math.random() * facts.length)];

  return res.json({ fact: fact });
});
/**
 * @swagger
 * /v1/fun/quote:
 *   get:
 *     description: Just getting an quote.
 *     tags: [fun]
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Error
 */
route.get("/quote", (req, res) => {
  const quote = quotes[Math.floor(Math.random() * quotes.length)];

  return res.json({
    content: quote.content,
    author: quote.author,
    tags: quote.tags,
    id: quote.authorId,
    slug: quote.authorSlug,
  });
});
/**
 * @swagger
 * /v1/fun/quote/author:
 *   get:
 *     description: Just getting an author from an quote.
 *     tags: [fun]
 *     parameters:
 *       - name: id
 *         description: The id from the author (need to use the id query or the slug query).
 *         in: query
 *         type: string
 *       - name: slug
 *         description: The slug from the author (need to use the id query or the slug query)
 *         in: query
 *         type: string
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Error
 */
const { getAuthorById, getAuthorBySlug } = require("../utils/quoteAuthors");
route.get("/quote/author", (req, res) => {
  if (req.query.id) return getAuthorById(req.query.id, res);
  if (req.query.slug && !req.query.id)
    return getAuthorBySlug(req.query.slug, res);
  if (!req.query.slug && !req.query.id)
    return res.json({
      error: true,
      message:
        "Need to atleast provide one query parameter: author id or author slug",
    });
});
module.exports = {
  endpoint: "/fun",
  router: route,
};
