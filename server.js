import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// Servir arquivos estáticos
app.use(express.static(__dirname));

// Rota específica para o arquivo BPMN
app.get("/processos/processo-mei.bpmn", (req, res) => {
  res.setHeader("Content-Type", "application/xml");
  res.sendFile(path.join(__dirname, "processos", "processo-mei.bpmn"));
});

// Rota principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Middleware para tratamento de erros
app.use((err, req, res, next) => {
  console.error("Erro do servidor:", err);
  res.status(500).json({ error: "Erro interno do servidor" });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor BPMN Viewer iniciado!`);
  console.log(`📊 Visualizador disponível em: http://localhost:${PORT}`);
  console.log(`📁 Diagrama: processo-mei.bpmn`);
  console.log(`⚡ Pressione Ctrl+C para parar o servidor`);
});

export default app;
