import { getBairroPadrao } from "../src/controllers/padrao.controller.js";

export default function handler(req, res) {
  if (req.method === "GET") {
    return getBairroPadrao(req, res);
  }

  res.status(405).json({ error: "Método não permitido" });
}
