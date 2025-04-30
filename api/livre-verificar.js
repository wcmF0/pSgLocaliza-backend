import { verificarRespostaLivre } from "../src/controllers/livre.controller.js";

export default function handler(req, res) {
  if (req.method === "POST") {
    return verificarRespostaLivre(req, res);
  }

  res.status(405).json({ error: "Método não permitido" });
}
