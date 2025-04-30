const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "..", "data", "bairros.json");
const bairros = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

const usuarios = {};

function gerarBairroAleatorio(usuarioIp) {
  if (!usuarios[usuarioIp]) {
    usuarios[usuarioIp] = {
      bairrosAcertados: [],
    };
  }

  const bairrosNaoAcertados = bairros.filter(
    (bairro) => !usuarios[usuarioIp].bairrosAcertados.includes(bairro.nome)
  );

  if (bairrosNaoAcertados.length === 0) {
    usuarios[usuarioIp].bairrosAcertados = [];
    return gerarBairroAleatorio(usuarioIp);
  }

  const indice = Math.floor(Math.random() * bairrosNaoAcertados.length);
  return bairrosNaoAcertados[indice];
}

exports.getBairroLivre = (req, res) => {
  const ip = req.ip;

  if (!usuarios[ip] || usuarios[ip].tentativasRestantes <= 0) {
    usuarios[ip] = {
      bairro: gerarBairroAleatorio(ip),
      tentativasRestantes: 5,
      imagemIndex: 0,
      bairrosAcertados: [],
    };
  }

  res.json({
    nome: usuarios[ip].bairro.nome,
    imagens: usuarios[ip].bairro.imagens,
  });
};

exports.verificarRespostaLivre = (req, res) => {
  const ip = req.ip;
  const { resposta } = req.body;

  if (!resposta || !usuarios[ip]) {
    return res.status(400).json({
      correto: false,
      erro: "Resposta inválida ou usuário não iniciado.",
    });
  }

  const usuario = usuarios[ip];
  const bairroAtual = usuario.bairro;

  if (usuario.tentativasRestantes <= 0) {
    return res.status(400).json({
      correto: false,
      erro: "Você esgotou suas tentativas. Tente novamente!",
    });
  }

  const correto =
    resposta.trim().toLowerCase() === bairroAtual.nome.toLowerCase();

  if (correto) {
    usuario.tentativasRestantes = 5;
    usuario.bairrosAcertados.push(bairroAtual.nome);
    usuario.bairro = gerarBairroAleatorio(ip);
    usuario.imagemIndex = 0;
  } else {
    usuario.tentativasRestantes -= 1;
  }

  res.json({
    correto,
    tentativasRestantes: usuario.tentativasRestantes,
    imagem: bairroAtual.imagens[usuario.imagemIndex],
  });
};
