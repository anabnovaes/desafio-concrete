const mongoose = require("mongoose");

//caminho do banco de dados
const DB_URL = process.env.MONGODB_URI || 'mongodb://localhost/desafio-concrete-backend'

const connect = () => {
    mongoose.connect(DB_URL, {useNewUrlParser:true})
const connection = mongoose.connection
connection.on("error",() => console.error("Erro ao conectar"))

connection.once("open", () => console.info("Conectamos"))
}

module.exports  = connect;