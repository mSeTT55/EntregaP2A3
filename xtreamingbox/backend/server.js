//Iniciando Express
import express from 'express'
const app = express()
const port = 5000


//Iniciando Banco
import sqlite3 from 'sqlite3'
//Chamando arquivo do banco
import {ConnectDBFile} from './dataBase/createDataBase.js'
//Criando arquivo do banco, tabelas e insets
ConnectDBFile ();
//Conectando ao Banco
const dataBaseFile = './dataBase/xtreamingbox.db'
const db = new sqlite3.Database(dataBaseFile, sqlite3.OPEN_READWRITE,(err)=>{
  if (err) {
    return console.error(err.message);
    }
  }
);



//Conectando API e entregando o endereço
function apiConectada(){
app.listen(port, () => {
  console.log(`API RODANDO no endereço http://localhost:${port}`)
})
}


//Servidor ouvindo API em 4 segundos
const delay3 = 4000; // Tempo de atraso em milissegundos (4 segundos)
setTimeout(apiConectada, delay3);


// Middleware para o uso do JSON
app.use(express.json());











/*CRUD DE USUÁRIOS------------------------------------------------------------------------------------------------*/

//Rota API GET para obter todos os usuários
app.get('/users', (req, res) => {
  db.all('SELECT * FROM usuarios', (err, rows) =>{
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Não conseguimos acessar informações dos usuários' });
    } else {
      res.json(rows);
    }
  });
});


//Rota API GET para obter um usuário por ID
app.get('/users/:id', (req, res) => {
  const { idusuario } = req.body;
  db.get('SELECT * FROM usuarios WHERE idusuario = ?', [idusuario], (err, row) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Não conseguimos acessar informações desse usuário' });
    } else if (row) {
      res.json(row);
    } else {
      res.status(404).json({ error: 'Usuário não encontrado' });
    }
  });
});


// Rota POST para criar um novo usuário
app.post('/users', (req, res) => {
  const { nome_completo, email, senha } = req.body;
  db.run('INSERT INTO usuarios (nome_completo, email, senha) VALUES (?, ?, ?)', [nome_completo, email, senha], function (err) {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro no cadastro do usuário' });
    } else {
      res.json({ id: this.lastID });
    }
  });
});


//Rota PUT para atualizar um usuário existente
app.put('/users/:id', (req, res) => {
  const { idusuario } = req.body;
  const { nome_completo, email, senha } = req.body;
  db.run('UPDATE usuarios SET nome_completo = ?, email = ?, senha = ? WHERE idusuario = ?', [nome_completo, email, senha,  idusuario], function (err) {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao atualizar dados do usuário' });
    } else if (this.changes > 0) {
      res.json({ message: 'Usuário atualizado com sucesso' });
    } else {
      res.status(404).json({ error: 'Usuário não encontrado' });
    }
  });
});


//Rota DELETE para excluir um usuário
app.delete('/users/:id', (req, res) => {
  const { idusuario } = req.body;
  db.run('DELETE FROM usuarios WHERE idusuario = ?', [idusuario], function (err) {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao excluir usuário' });
    } else if (this.changes > 0) {
      res.json({ message: 'Usuário excluído com sucesso' });
    } else {
      res.status(404).json({ error: 'Usuário não encontrado' });
    }
  });
});


/*CRUD DE PLATAFORMA------------------------------------------------------------------------------------------------*/

//Rota API GET para obter todas as plataformas
app.get('/plataformas', (req, res) => {
  db.all('SELECT * FROM plataforma', (err, rows) =>{
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Não conseguimos acessar informações das plataforma' });
    } else {
      res.json(rows);
    }
  });
});


//Rota API GET para obter uma plataforma por ID
app.get('/plataformas/:id', (req, res) => {
  const { idplataforma } = req.body;
  db.get('SELECT * FROM plataforma WHERE idplataforma = ?', [idplataforma], (err, row) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Não conseguimos acessar informações dessa plataforma' });
    } else if (row) {
      res.json(row);
    } else {
      res.status(404).json({ error: 'Plataforma não encontrada' });
    }
  });
});


// Rota POST para criar uma nova plataforma
app.post('/plataformas', (req, res) => {
  const { nome_plataforma, imagem_plataforma } = req.body;
  db.run('INSERT INTO plataforma (nome, imagemplataforma) VALUES (?, ?)', [nome_plataforma, imagem_plataforma], function (err) {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao cadastrar plataforma' });
    } else {
      res.json({ id: this.lastID });
    }
  });
});


//Rota PUT para atualizar uma plataforma existente
app.put('/plataforma/:id', (req, res) => {
  const { idplataforma } = req.body;
  const { nome_plataforma, imagem_plataforma  } = req.body;
  db.run('UPDATE plataforma SET nome = ?, imagemplataforma = ?', [nome_plataforma, imagem_plataforma ], function (err) {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao atualizar plataforma no banco de dados' });
    } else if (this.changes > 0) {
      res.json({ message: 'Plataforma atualizado com sucesso' });
    } else {
      res.status(404).json({ error: 'Plataforma não encontrado' });
    }
  });
});


//Rota DELETE para excluir uma plataforma
app.delete('/plataforma/:id', (req, res) => {
  const { idplataforma } = req.body;
  db.run('DELETE FROM plataforma WHERE idplataforma = ?', [idplataforma], function (err) {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao excluir plataforma de streaming' });
    } else if (this.changes > 0) {
      res.json({ message: 'Plataforma excluída com sucesso' });
    } else {
      res.status(404).json({ error: 'Plataforma não encontrada' });
    }
  });
});


/*PLATAFORMA FIM------------------------------------------------------------------------------------------------*/

/*CRUD DE CONTATO------------------------------------------------------------------------------------------------*/


//Rota API GET para obter todos as mensagens
app.get('/contatos', (req, res) => {
  db.all('SELECT * FROM contato', (err, rows) =>{
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Não conseguimos acessar informações da caixa de mensagem' });
    } else {
      res.json(rows);
    }
  });
});


//Rota API GET para obter uma mensagem por ID
app.get('/contatos/:id', (req, res) => {
  const { idcontato } = req.body;
  db.get('SELECT * FROM contato WHERE idcontato = ?', [idcontato], (err, row) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Não conseguimos acessar informações desse contato' });
    } else if (row) {
      res.json(row);
    } else {
      res.status(404).json({ error: 'Contato não encontrado não encontrado' });
    }
  });
});


// Rota POST para criar uma nova mensagem
app.post('/contatos', (req, res) => {
  const { nome_completo, email, mensagem } = req.body;
  db.run('INSERT INTO usuarios (nome, email, mensagem) VALUES (?, ?, ?)', [nome_completo, email, mensagem], function (err) {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Sua mensagem não foi enviada, tente denovo.' });
    } else {
      res.json({ id: this.lastID });
    }
  });
});


//Rota PUT para atualizar um usuário existente
app.put('/contato/:id', (req, res) => {
  const { idcontato } = req.body;
  const { nome_completo, email, mensagem } = req.body;
  db.run('UPDATE contato SET nome = ?, email = ?, mensagem = ? WHERE idcontato = ?', [nome_completo, email, mensagem,  idcontato], function (err) {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao atualizar mensagens enviadas' });
    } else if (this.changes > 0) {
      res.json({ message: 'Mensagem atualizada com sucesso' });
    } else {
      res.status(404).json({ error: 'Mensagem não encontrada' });
    }
  });
});


//Rota DELETE para excluir um usuário
app.delete('/contato/:id', (req, res) => {
  const { idcontato } = req.body;
  db.run('DELETE FROM contato WHERE idcontato = ?', [idcontato], function (err) {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao excluir mensagem' });
    } else if (this.changes > 0) {
      res.json({ message: 'Mensagem excluída com sucesso' });
    } else {
      res.status(404).json({ error: 'Mensagem não encontrada' });
    }
  });
});

