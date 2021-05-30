const {Router } = require('express')
const route = Router()
const fetch = require('node-fetch')

route.get('/covid', async (req, res) => {
const rese = await fetch("https://disease.sh/v3/covid-19/all").then(rese => rese.json())

return res.json(rese)
})


module.exports = {
    endpoint: "/info",
    router: route
}