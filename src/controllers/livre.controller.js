const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "..", "data", "bairros.json");
const bairros = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

const usuarios = {}; // chave = IP, valor = bairro atual, número de tentativas e bairros acertados

function gerarBairroAleatorio(usuarioIp) {
  // Garante que o objeto do usuário está criado
  if (!usuarios[usuarioIp]) {
    usuarios[usuarioIp] = {
      bairrosAcertados: [], // Inicializa a lista de bairros acertados
    };
  }

  // Filtra os bairros não acertados pelo usuário
  const bairrosNaoAcertados = bairros.filter(
    (bairro) => !usuarios[usuarioIp].bairrosAcertados.includes(bairro.nome)
  );

  if (bairrosNaoAcertados.length === 0) {
    // Se o usuário já acertou todos os bairros, reinicia a lista de bairros acertados
    usuarios[usuarioIp].bairrosAcertados = [];
    return gerarBairroAleatorio(usuarioIp); // Chama recursivamente para reiniciar
  }

  const indice = Math.floor(Math.random() * bairrosNaoAcertados.length);
  return bairrosNaoAcertados[indice];
}

exports.getBairroLivre = (req, res) => {
  const ip = req.ip;

  // Se o usuário não existir ou o bairro já foi perdido, cria um novo usuário
  if (!usuarios[ip] || usuarios[ip].tentativasRestantes <= 0) {
    usuarios[ip] = {
      bairro: gerarBairroAleatorio(ip),
      tentativasRestantes: 5, // Inicia com 5 tentativas
      imagemIndex: 0, // Começa com a primeira imagem
      bairrosAcertados: [], // Lista de bairros acertados
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
    // Resposta correta: Zera tentativas, escolhe novo bairro e marca como acertado
    usuario.tentativasRestantes = 5;
    usuario.bairrosAcertados.push(bairroAtual.nome); // Marca o bairro como acertado
    usuario.bairro = gerarBairroAleatorio(ip);
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
