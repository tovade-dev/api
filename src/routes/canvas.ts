import { Router } from "express"

const route = Router()
/**
 * @swagger
 * /canvas/string:
 *   get:
 *     description: Hi
 *     tags: [Canvas]
 *     parameters:
 * 
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Error
 */
route.get("/string", (req, res) => {
    return res.json({ text: "hi"})
})



export default {
    endpoint: "/canvas",
    router: route
}