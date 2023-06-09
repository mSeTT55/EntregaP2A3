//Iniciando Express
import express from 'express'
import cors from 'cors'
const app = express()
app.use(cors())
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




app.get('/', (req, res) => {
  res.json({ message: "Tudo ok por aqui!"});
})



/*CRUD DE USUÁRIOS------------------------------------------------------------------------------------------------*/

//Rota API GET para obter todos os usuários
app.get('/usuario/get/all', (req, res) => {
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
app.get('/usuario/get/:id', (req, res) => {
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
app.post('/usuario/post/novo', (req, res) => {
  const { nome_completo, email, senha, confirm_senha } = req.body;
  db.run('INSERT INTO usuarios (nome_completo, email, senha, confirm_senha) VALUES (?, ?, ?, ?)', [nome_completo, email, senha, confirm_senha], function (err) {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro no cadastro do usuário' });
    } else {
      res.json({ id: this.lastID });
    }
  });
});


//Rota PUT para atualizar um usuário existente
app.put('/usuario/update/:id', (req, res) => {
  const { idusuario } = req.body;
  const { nome_completo, email, senha, confirm_senha } = req.body;
  db.run('UPDATE usuarios SET nome_completo = ?, email = ?, senha = ?, confirm_senha = ? WHERE idusuario = ?', [nome_completo, email, senha, confirm_senha, idusuario], function (err) {
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
app.delete('/usuario/delete/:id', (req, res) => {
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
app.get('/plataformas/get/all', (req, res) => {
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
app.get('/plataformas/get/:id', (req, res) => {
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
app.post('/plataformas/post/novo', (req, res) => {
  const { nome, imagemplataforma } = req.body;
  db.run('INSERT INTO plataforma (nome, imagemplataforma) VALUES (?, ?)', [nome, imagemplataforma], function (err) {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao cadastrar plataforma' });
    } else {
      res.json({ id: this.lastID });
    }
  });
});


//Rota PUT para atualizar uma plataforma existente
app.put('/plataforma/update/:id', (req, res) => {
  const { idplataforma } = req.body;
  const { nome, imagemplataforma  } = req.body;
  db.run('UPDATE plataforma SET nome = ?, imagemplataforma = ? WHERE idplataforma = ?', [nome, imagemplataforma, idplataforma ], function (err) {
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
app.delete('/plataforma/delete/:id', (req, res) => {
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


/*CRUD DE CONTATO------------------------------------------------------------------------------------------------*/

//Rota API GET para obter todos as mensagens
app.get('/contatos/get/all', (req, res) => {
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
app.get('/contatos/get/:id', (req, res) => {
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
app.post('/contatos/post/novo', (req, res) => {
  const { nome, email, mensagem } = req.body;
  db.run('INSERT INTO contato (nome, email, mensagem) VALUES (?, ?, ?)', [nome, email, mensagem], function (err) {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Sua mensagem não foi enviada, tente denovo.' });
    } else {
      res.json({ id: this.lastID });
    }
  });
});


//Rota PUT para atualizar uma mensagem existente
app.put('/contatos/update/:id', (req, res) => {
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


//Rota DELETE para excluir uma mensagem
app.delete('/contatos/delete/:id', (req, res) => {
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

/*CRUD DE SERIES------------------------------------------------------------------------------------------------*/

//Rota API GET para obter todos as series
app.get('/series/get/all', (req, res) => {
  db.all('SELECT * FROM series', (err, rows) =>{
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Não conseguimos acessar informações das séries' });
    } else {
      res.json(rows);
    }
  });
});


//Rota API GET para obter uma serie por ID
app.get('/series/get/:id', (req, res) => {
  const { idseries } = req.body;
  db.get('SELECT * FROM series WHERE idseries = ?', [idseries], (err, row) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Não conseguimos acessar informações dessa série' });
    } else if (row) {
      res.json(row);
    } else {
      res.status(404).json({ error: 'Série não encontrado' });
    }
  });
});


// Rota POST para criar um novo cadastro de série
app.post('/series/post/novo', (req, res) => {
  const { plataforma_idplataforma, nome, ano, genero, imagem_serie, sinopse, temporada} = req.body;
  db.run('INSERT INTO series (plataforma_idplataforma, nome, ano, genero, imagem_serie, sinopse, temporada) VALUES (?, ?, ?, ?, ?, ?, ?)', [plataforma_idplataforma, nome, ano, genero, imagem_serie, sinopse, temporada], function (err) {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro no cadastro do série' });
    } else {
      res.json({ id: this.lastID });
    }
  });
});


//Rota PUT para atualizar uma série 
app.put('/series/update/:id', (req, res) => {
  const { idseries} = req.body;
  const { plataforma_idplataforma, nome, ano, genero, imagem_serie, sinopse, temporada } = req.body;
  db.run('UPDATE series SET plataforma_idplataforma = ?, nome = ?, ano = ?, genero = ?, imagem_serie = ?, sinopse = ?, temporada = ? WHERE idseries = ?', [plataforma_idplataforma, nome, ano, genero, imagem_serie, sinopse, temporada, idseries], function (err) {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao atualizar dados da série' });
    } else if (this.changes > 0) {
      res.json({ message: 'Série atualizada com sucesso' });
    } else {
      res.status(404).json({ error: 'Série não encontrado' });
    }
  });
});


//Rota DELETE para excluir uma serie
app.delete('/series/delete/:id', (req, res) => {
  const { idseries } = req.body;
  db.run('DELETE FROM series WHERE idseries = ?', [idseries], function (err) {
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


/*CRUD DE SITUAÇÃO SERIES------------------------------------------------------------------------------------------------*/

//Rota API GET para obter todos resultados e situações
app.get('/situacao_series/get/all', (req, res) => {
  db.all('SELECT * FROM situacao_serie', (err, rows) =>{
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Não conseguimos analisar sua situação' });
    } else {
      res.json(rows);
    }
  });
});


//Rota API GET para obter todas as situação por ID
app.get('/situacao_series/get/:id', (req, res) => {
  const { idsituacao_serie } = req.body;
  db.get('SELECT * FROM situacao_serie WHERE idsituacao_serie = ?', [idsituacao_serie], (err, row) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Não conseguimos identificar a situação' });
    } else if (row) {
      res.json(row);
    } else {
      res.status(404).json({ error: 'Situação não encontrada' });
    }
  });
});


// Rota POST para criar uma nova situação
app.post('/situacao_serie/post/novo', (req, res) => {
  const { desejo_assistir, assistido, recomendado, series_idseries, series_plataforma_idplataforma, usuario_idusuario } = req.body;
  db.run('INSERT INTO situacao_serie (desejo_assistir, assistido, recomendado , series_idseries, series_plataforma_idplataforma, usuario_idusuario) VALUES (?, ?, ?, ?, ?, ?)', [desejo_assistir, assistido, recomendado, series_idseries, series_plataforma_idplataforma, usuario_idusuario], function (err) {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao cadastrar situação' });
    } else {
      res.json({ id: this.lastID });
    }
  });
});


//Rota PUT para atualizar situação
app.put('/situacao_serie/update/:id', (req, res) => {
  const { idsituacao_serie } = req.body;
  const { desejo_assistir, assistido, recomendado, series_idseries, series_plataforma_idplataforma, usuario_idusuario } = req.body;
  db.run('UPDATE situacao_serie SET desejo_assistir = ?, assistido = ?, recomendado = ?,series_idseries = ?, series_plataforma_idplataforma = ?, usuario_idusuario = ? WHERE idsituacao_serie = ?', [desejo_assistir, assistido, recomendado, series_idseries, series_plataforma_idplataforma, usuario_idusuario, idsituacao_serie], function (err) {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao atualizar a situação' });
    } else if (this.changes > 0) {
      res.json({ message: 'Situação atualizada com sucesso' });
    } else {
      res.status(404).json({ error: 'Situação não encontrada' });
    }
  });
});


//Rota DELETE para excluir a situação
app.delete('/situacao_serie/delete/:id', (req, res) => {
  const { idsituacao_serie } = req.body;
  db.run('DELETE FROM situacao_serie WHERE idsituacao_serie = ?', [idsituacao_serie], function (err) {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao excluir situação' });
    } else if (this.changes > 0) {
      res.json({ message: 'Situação excluída com sucesso' });
    } else {
      res.status(404).json({ error: 'Situação não encontrado' });
    }
  });
});