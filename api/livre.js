import { getBairroLivre } from "../src/controllers/livre.controller.js";

export default function handler(req, res) {
  if (req.method === "GET") {
    return getBairroLivre(req, res);
  }

  res.status(405).json({ error: "Método não permitido" });
}
