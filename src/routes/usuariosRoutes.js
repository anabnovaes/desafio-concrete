const express = require("express");
const router = express.Router();
const controller = require("../controller/usuariosController")
const SEGREDO = process.env.SEGREDO

const autenticarUsuario = (request, response, next) => {
    const authHeader = request.get("authorization")
    if (!authHeader) {
        return response.status(403).json({ "erro": "Não autorizado" })
    }

    const token = authHeader.split(" ")[1]

    jwt.verify(token, SEGREDO, (error, decoded) => {
        if (error) {
        return response.status(403).json({ "erro": "Não autorizado" })
        } 

    })
    next()
}
router.post("/", controller.add)
router.post("/login", controller.login)


module.exports = router