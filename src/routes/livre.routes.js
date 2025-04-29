const express = require("express");
const router = express.Router();
const livreController = require("../controllers/livre.controller.js");

router.get("/", livreController.getBairroLivre);
router.post("/verificar", livreController.verificarRespostaLivre);

module.exports = router;
