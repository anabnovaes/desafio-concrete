const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const contatosUsuario = new Schema({
    numero: { type: Number },
    ddd: { type: Number, min: 11, max: 99 }
});
const usuarioSchema = new Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true, required: true },
    nome: { type: String, },
    token: { type: String },
    email: { type: String, unique: true },
    senha: { type: String },
    telefones: [contatosUsuario],
    data_criacao: { type: Date, required: true, auto: true, default: Date.now },
    data_atualizacao: { type: Date, default: null },
    ultimo_login: { type: Date, required: true, auto: true, default: Date.now },
});

const usuariosModel = mongoose.model("usuarios", usuarioSchema);

module.exports = {
    usuariosModel,
    usuarioSchema
}