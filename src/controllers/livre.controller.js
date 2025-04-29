const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "..", "data", "bairros.json");
const bairros = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

const usuarios = {}; // chave = IP, valor = bairro atual e o número de tentativas restantes

function gerarBairroAleatorio() {
  const indice = Math.floor(Math.random() * bairros.length);
  return bairros[indice];
}

exports.getBairroLivre = (req, res) => {
  const ip = req.ip;

  // Se o usuário não existir ou o bairro já foi perdido, cria um novo usuário
  if (!usuarios[ip] || usuarios[ip].tentativasRestantes <= 0) {
    usuarios[ip] = {
      bairro: gerarBairroAleatorio(),
      tentativasRestantes: 5, // Inicia com 5 tentativas
      imagemIndex: 0, // Começa com a primeira imagem
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
    // Resposta correta: Zera tentativas e escolhe novo bairro
    usuario.tentativasRestantes = 5;
    usuario.bairro = gerarBairroAleatorio();
    usuario.imagemIndex = 0; // Zera o índice de imagens
  } else {
    // Resposta incorreta: Diminui tentativas
    usuario.tentativasRestantes -= 1;
  }

  res.json({
    correto,
    tentativasRestantes: usuario.tentativasRestantes,
    imagem: bairroAtual.imagens[usuario.imagemIndex],
  });
};
