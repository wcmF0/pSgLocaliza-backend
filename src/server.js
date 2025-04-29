const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3001;

const padraoRoutes = require("./routes/padrao.routes.js");
const livreRoutes = require("./routes/livre.routes.js");

app.use(cors());
app.use(express.json());

app.use("/api/padrao", padraoRoutes);
app.use("/api/livre", livreRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
