const { usuariosModel } = require("../model/usuariosSchema");
const bcrypt = require("bcryptjs");
const options = { new: true }
const jwt = require('jsonwebtoken')
const SEGREDO = process.env.SEGREDO

const gerarCriptografias = (dadosUsuario) => {
  const senhaCriptografada = bcrypt.hashSync(dadosUsuario.senha)
  console.log(senhaCriptografada)
  dadosUsuario.senha = senhaCriptografada
  dadosUsuario.token = jwt.sign(
    {
      email: dadosUsuario.email
    },
    SEGREDO
  )
  return dadosUsuario

}
const localizarUsuario = async (dadosPesquisa, response) => {
  const respostaConsulta = await usuariosModel.findOne(dadosPesquisa, (error) => {
    if (error) {
      return response.status(401).json({ "erro": "Usuário e/ou senha inválidos" })
    }

  });
  return respostaConsulta
}



const add = async (request, response) => {
  const dadosRequisicao = request.body
  const usuarioCriptografado = gerarCriptografias(dadosRequisicao)
  const novoUsuario = new usuariosModel(usuarioCriptografado);
  novoUsuario.save((error) => {
    if (error) {
      return response.status(500).json({ erro : error })
    }

    return response.status(201).json(novoUsuario)
  })
}


const login = async (request, response) => {
  const usuarioEncontrado = await localizarUsuario({ email: request.params.email }, response)
  const comparacaoSenhas = bcrypt.compareSync(request.body.senha, usuarioEncontrado.senha)
  if (!comparacaoSenhas) {
    return response.status(401).json({ "erro": "Usuário e/ou senha inválidos" })
  }

  usuariosModel.findByIdAndUpdate(usuarioEncontrado.id, { "ultimo_login": new Date() }, options, (error, usuario) => {
    if (error) {
      return response.status(500).send(error)

    } else {
      if (filme) {
        return response.status(200).send(usuario)
      } else {
        return response.status(404).json({ "erro": "Erro de atualização" })
      }
    }
  })

}

const getUsuarios = (request, response) => {

}

module.exports = {
  add,
  login,
  getUsuarios
}