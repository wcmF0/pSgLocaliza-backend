const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "..", "data", "bairros.json");
let bairroDoDia = null;
let dataUltimaEscolha = null;

function escolherBairroDoDia() {
  const bairros = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
  const indice = Math.floor(Math.random() * bairros.length);
  bairroDoDia = bairros[indice];
  dataUltimaEscolha = new Date().toDateString();
}

escolherBairroDoDia();

// Atualiza o bairro do dia a cada 24 horas
setInterval(() => {
  const hoje = new Date().toDateString();
  if (hoje !== dataUltimaEscolha) {
    escolherBairroDoDia();
  }
}, 24 * 60 * 60 * 1000); // 24 horas em milissegundos

exports.getBairroPadrao = (req, res) => {
  if (!bairroDoDia) {
    return res.status(500).json({ erro: "Bairro do dia não definido." });
  }
  res.json({ nome: bairroDoDia.nome, imagens: bairroDoDia.imagens });
};

exports.verificarRespostaPadrao = (req, res) => {
  const { resposta } = req.body;
  if (!resposta || !bairroDoDia) {
    return res.status(400).json({ correto: false, erro: "Resposta inválida." });
  }

  const correto =
    resposta.trim().toLowerCase() === bairroDoDia.nome.toLowerCase();

  if (correto) {
    return res.json({ correto, mensagem: "🎉 Você acertou o bairro do dia!" });
  } else {
    // Caso erro: troque a imagem
    const imagemIndex = bairroDoDia.imagens.indexOf(req.body.imagem);
    const proximaImagem =
      imagemIndex < bairroDoDia.imagens.length - 1
        ? bairroDoDia.imagens[imagemIndex + 1]
        : null;

    res.json({
      correto,
      mensagem: "❌ Errou! Veja mais uma imagem...",
      imagem: proximaImagem,
    });
  }
};
