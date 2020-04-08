const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const logTime = require("./midlewares/logTime");

const app = express();

app.use(express.json());
app.use(cors());

app.use(logTime);

const repositories = [];

app.get("/repositories", (req, res) => {
  return res.json(repositories);
});

app.post("/repositories", (req, res) => {
  const { title, url, techs } = req.body;
  
  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);

  return res.json(repository);
});

app.put("/repositories/:id", (req, res) => {
  const { id } = req.params;

  if(!isUuid(id)) {
    return res.status(400).json({error: 'You must inform a valid Id.'})
  }

  const { title, url, techs } = req.body;

  const repos = repositories.map(repo => {
    var temp = {...repo};
    if(repo.id === id) {
       return {
         ...repo,
         title: title && temp.title !== title ? title : temp.title,
         url: url && temp.url !== url ? url : temp.url,
         techs: techs && Array.isArray(techs) && temp.techs !== techs ? techs : temp.techs,
        }
    } else {
      return {...repo};
    }
  });

  repositories.splice(0, repositories.length, ...repos);

  return res.json(repositories.find(repo => repo.id === id));
});

app.delete("/repositories/:id", (req, res) => {
  const { id } = req.params;

  if(!isUuid(id)) {
    return res.status(400).json({error: 'You must inform a valid Id.'})
  }

  const itemIdex = repositories.findIndex(repo => repo.id === id);
  
  repositories.splice(itemIdex, 1);
  
  return res.status(204).json();
});

app.post("/repositories/:id/like", (req, res) => {
  const { id } = req.params;

  if(!isUuid(id)) {
    return res.status(400).json({error: 'You must inform a valid Id.'})
  }

  const repos = repositories.map(repo => {
    var temp = {...repo};
    if(repo.id === id) {
       return {
         ...repo,
         likes: repo.likes + 1,
        }
    } else {
      return {...repo};
    }
  });

  repositories.splice(0, repositories.length, ...repos);

  return res.json(repositories.find(repo => repo.id === id));
});

module.exports = app;
