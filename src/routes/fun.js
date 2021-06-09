const {Router } = require('express')
const cheerio = require('cheerio')
const fetch = require('node-fetch')
const route = Router()


/**
 * @swagger
 * /v1/fun/wyr:
 *   get:
 *     description: Don't know
 *     tags: [fun]
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Error
 */
route.get('/wyr', async (req, res) => {
    const data = await fetch("http://either.io").then((resp) => resp.text());
    const $ = cheerio.load(data);

    const wyr = String($('div[class="option"] a').text()).split("\n");
    return res.json({ questions: [wyr[1].trim(), wyr[2].trim()]})[wyr[1].trim(), wyr[2].trim()];
})


module.exports = {
    endpoint: "/fun",
    router: route
}