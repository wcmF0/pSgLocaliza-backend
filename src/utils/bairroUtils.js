// src/utils/bairroUtils.js
const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "../data", "bairros.json");

let bairroAtual = null;

function escolherBairroDoDia() {
  try {
    const data = fs.readFileSync(dataPath, "utf-8");
    const bairros = JSON.parse(data);

    if (bairros.length === 0) {
      console.error("Arquivo bairros.json está vazio!");
      return null;
    }

    const indice = Math.floor(Math.random() * bairros.length);
    bairroAtual = bairros[indice];
    console.log("Bairro selecionado:", bairroAtual.nome);
    return bairroAtual;
  } catch (error) {
    console.error("Erro ao ler bairros.json:", error);
    return null;
  }
}

function getBairroAtual() {
  return bairroAtual;
}

function atualizarBairroDoDia() {
  setInterval(() => {
    const agora = new Date();
    if (agora.getHours() === 0 && agora.getMinutes() === 0) {
      escolherBairroDoDia();
    }
  }, 60 * 1000);
}

module.exports = { escolherBairroDoDia, getBairroAtual, atualizarBairroDoDia };
