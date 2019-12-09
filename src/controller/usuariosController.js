const { usuariosModel } = require("../model/usuariosSchema");
const bcrypt = require("bcryptjs");
const options = { new: true }
const jwt = require("jsonwebtoken")
const SEGREDO = process.env.SEGREDO

const gerarCriptografias = (dadosUsuario) => {
  const senhaCriptografada = bcrypt.hashSync(dadosUsuario.senha)
  dadosUsuario.senha = senhaCriptografada
  const token = jwt.sign(
    {
      email: dadosUsuario.email
    },
    SEGREDO
  )
  dadosUsuario.token = bcrypt.hashSync(token)
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
  const verificarCadastro = await usuariosModel.findOne({email: request.body.email})
  if(verificarCadastro){
    return response.status(401).json({erro: "Email já existente!"})
  }
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
  //localizando usuário na base 
  const usuarioEncontrado = await localizarUsuario({ email: request.params.email }, response)
  // realizando a comparação de senhas
  const comparacaoSenhas = bcrypt.compareSync(request.body.senha, usuarioEncontrado.senha)
  if (!comparacaoSenhas) {
    return response.status(401).json({ "erro": "Usuário e/ou senha inválidos" })
  }
  
  //salvando a data de login e exibindo os dados 
  usuariosModel.findByIdAndUpdate(usuarioEncontrado.id, { "ultimo_login": new Date() }, options, (error, usuario) => {
    if (error) {
      return response.status(500).json({erro: error})

    } else {
      if (usuario) {
        return response.status(200).send(usuario)
      } else {
        return response.status(404).json({ "erro": "Erro de atualização" })
      }
    }
  })

}


module.exports = {
  add,
  login
}