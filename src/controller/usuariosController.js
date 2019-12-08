const { usuariosModel } = require("../model/usuariosSchema");
const bcrypt = require("bcryptjs");
const options = { new: true }
const jwt = require('jsonwebtoken')
const SEGREDO = 'MIICXAIBAAKBgQCOl54HaBM/WiL/jPPdFGjm9f8VprUst1J+vs7G/YRGRHYLGqt+M/ljAhcROPy3FdaVi2smqqyZhf4d+EZ9lKM6LVed91sxvcyMFEp6x8R2KS9wIzUtJ6r1MAIKd8HURmbaN4V2TV/FLeOUANRCZ+QhYEy+eNbuVIJANYtXBUSn8QIDAQABAoGBAIuVS/MAJGdNuxjiSA5Q3mfIw03UhWIiirTb39rXbNbESbGRB/NguW38K8yGNoya6hY2BkwxowgeLKX11js0d5sSHgEgL+pDQtXshHu7vlYU0ksHwfmD/R8+ZHJH6F6L0vuzs4NoVK/8iQHFLboUjF2sORyuLHbBmFZQWhInet8pAkEA0OlL2uHCYhkNuokJ9H+OnJEqKS2BtYSkH3Hrh2opZg2HtvUtXEIxzmj/95CzxMXQtNJhQMK3ekvnF3Upcj2avwJBAK67i8OEKM2jerbFKrBqr6/kUkZeyHLA8I4L2C3/3nKPGUj/GAc2xxuK1XxnpC0e3Wqz5OMwzkWU4Ynblsdq2U8CQHu9U6LICbzVHh6YwP7C9xOhoBlXzPZZJGVDssA4j2DVLsednUqCIsIhy0s1uGUazi3sVpJnQwn7H1vzl6ME/j0CQAT7qj+4LCW5LM27j70aPcppW4NQPq0vHW0fn1moe2KO/CydwcSq5kC909rJZeA3ih755GQqRyeq2EfDMGidfncCQD770Za6sJP1/i1vcdoWuWYnhpiU8TNKjFb2vJEN598amcyJV9PlAAdEkszh6EDA76t6/yT6NoUn/y9x4YskzQo='

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