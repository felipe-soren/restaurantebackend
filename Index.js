const express = require('express');
const app = express();         
const bodyParser = require('body-parser');
const mysql = require('mysql');
const axios = require('axios')

//configurando o body parser para pegar POSTS mais tarde
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//definindo as rotas
const router = express.Router();
router.get('/', (req, res) => res.json({ message: 'Funcionando!' }));
app.use('/', router);
router.get('/pedidos', (req, res) =>{
    execSQLQuery('SELECT * FROM Pedidos', res);
});
router.get('/pedidos/pendentes', (req, res) =>{
  execSQLQuery("SELECT * FROM Pedidos WHERE Recebido = 'Não' " , res);
})
router.get('/pedidos/update', (req, res) =>{
  execSQLQuery(`UPDATE Pedidos SET Recebido = 'Sim' WHERE Recebido = 'Não' `, res);
})
router.post('/pedidos', (req, res) =>{
  const item = req.body.item.substring(0,150);
  const preco = req.body.preco.substring(0,11);
  execSQLQuery(`INSERT INTO Pedidos(Item, Preço, Recebido) VALUES('${item}','${preco}', 'Não')`);
  retorno = execSQLQuery(`SELECT * FROM Pedidos ORDER BY ID DESC LIMIT 1`, res, true);
  console.log(retorno)
});

async function execSQLQuery(sqlQry, res, firebase){
  const connection = mysql.createConnection({
    host     : 'mysql873.umbler.com',
    port     : 41890,
    user     : 'shinoratsu',
    password : 'felipe10',
    database : 'restaurante'
  });
 
  await connection.query(sqlQry, function(error, results, fields){
      if(error) 
        res.json(error);
      if(res != null)
        res.json(results);
      if (firebase)
        patchIdToFirebase(results[0].ID)
      connection.end();
      console.log('executou!');
  });
}

function patchIdToFirebase(id){
  axios.patch('https://teste-51f18.firebaseio.com/Delivery/clientes/cliente1/.json', {
    recebido: id
  })
  .then((res) => {
    console.log(`statusCode: ${res.statusCode}`)
    console.log(res)
  })
  .catch((error) => {
    console.error(error)
  })
}

//inicia o servidor
var port = process.env.PORT || 8080;
app.listen(port);
console.log('API funcionando!');