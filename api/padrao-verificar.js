import { verificarRespostaPadrao } from "../src/controllers/padrao.controller.js";

export default function handler(req, res) {
  if (req.method === "POST") {
    return verificarRespostaPadrao(req, res);
  }

  res.status(405).json({ error: "Método não permitido" });
}
