const express = require("express");
const server = express();

// para permitir receber os posts em json
server.use(express.json());

//iniciando ''banco de dados''
let projects = new Array();

let contador = 0;

server.use((req, res, next) => {
  console.log("quantidade de requisicoes:", contador++);
  return next();
});

function verificaSeUsuarioComIdExiste(req, res, next) {
  const { id } = req.params;

  projects.find(response => {
    if (response.id == id) {
      next();
    }
  });

  return res.status(400).json({ error: `usuario com id ${id} nao encontrado` });
}

server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.post("/projects", (req, res) => {
  const { id, title } = req.body;

  const project = {
    id: id,
    title: title
  };

  projects.push(project);
  return res.json(projects);
});

server.post("/projects/:id/tasks", verificaSeUsuarioComIdExiste, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  projects.find(response => {
    if (response.id == id) {
      response.tasks = new Array();
      response.tasks.push(title);
    }
  });

  return res.json(projects);
});

server.put("/projects/:id", verificaSeUsuarioComIdExiste, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  projects.find(response => {
    if (response.id == id) {
      response.title = title;
    }
  });

  return res.json(projects);
});

server.delete("/projects/:id", verificaSeUsuarioComIdExiste, (req, res) => {
  const { id } = req.params;

  const indice = projects.findIndex(response => {
    return response.id == id;
  });

  projects.splice(indice, 1);

  return res.send();
});

server.listen(3002);
