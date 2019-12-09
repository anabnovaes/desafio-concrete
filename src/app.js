const express = require("express");
require("dotenv-safe").load();
const bodyParser = require("body-parser");
const index = require("./routes/index"); 
const usuarios = require("./routes/usuariosRoutes");
const database = require("./model/database");
const app = express();


database()
app.use(bodyParser.json())

app.use(function (request, response, next) {
    response.header("Access-Control-Allow-Origin", "*")
    response.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    )
    next()
  })
  

app.use("/", index)
app.use("/usuarios", bodyParser.json(), usuarios)




module.exports = app