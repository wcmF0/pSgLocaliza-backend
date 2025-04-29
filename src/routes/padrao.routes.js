const express = require("express");
const router = express.Router();
const padraoController = require("../controllers/padrao.controller.js");

router.get("/", padraoController.getBairroPadrao);
router.post("/verificar", padraoController.verificarRespostaPadrao);

module.exports = router;
