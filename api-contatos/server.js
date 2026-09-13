const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para permitir requisições de outras origens (CORS) e JSON
app.use(cors());
app.use(express.json());

// Banco de dados temporário na memória
let contatos = [];
let proximoId = 1;

// ROTA 1: Salvar um novo contato (POST)
app.post("/contatos", (req, res) => {
  const { nome, numero } = req.body;

  // Validação simples dos dados recebidos
  if (!nome || !numero) {
    return res.status(400).json({ erro: "Nome e numero são obrigatórios." });
  }

  // Criar o objeto do contato com um ID único
  const novoContato = {
    id: proximoId++,
    nome,
    numero,
  };

  // Salvar na lista
  contatos.push(novoContato);

  // Retornar o contato criado com status 201 (Created)
  return res.status(201).json(novoContato);
});

app.delete("/contatos/:id", (req, res) => {
  const idDoContato = Number(req.params.id);

  if (isNaN(idDoContato)) {
    return res.status(400).json({ erro: "ID do contato inválido." });
  }

  const index = contatos.findIndex((c) => c.id === idDoContato);
  if (index === -1) {
    return res.status(404).json({ erro: "Contato não encontrado." });
  }
  contatos.splice(index, 1);
  console.log(`Contato com ID ${idDoContato} removido com sucesso.`);
  return res.status(200).json({ mensagem: "Contato deletado com sucesso!" });
});

// ROTA 2: Listar todos os contatos salvos (GET)
app.get("/contatos", (req, res) => {
  return res.json(contatos);
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando com sucesso em http://localhost:${PORT}`);
});
