const app = require("./src/app")
const PORT = process.env.port || 3000

app.listen(PORT, () =>{
    console.log(`App rodando na porta ${PORT}`)
})