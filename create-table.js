const mysql      = require('mysql');
const connection = mysql.createConnection({
  host     : 'mysql873.umbler.com',
  port     : 41890,
  user     : 'shinoratsu',
  password : 'felipe10',
  database : 'restaurante'
});

connection.connect(function(err){
  if(err) return console.log(err);
  console.log('conectou!');
  createTable(connection);
  addRows(connection);
})

function createTable(conn){

    const sql = "CREATE TABLE IF NOT EXISTS Pedidos (\n"+
                "ID int NOT NULL AUTO_INCREMENT,\n"+
                "Item varchar(150) NOT NULL,\n"+
                "Preço varchar(11) NOT NULL,\n"+
                "Recebido varchar(5) NOT NULL,\n"+
                "PRIMARY KEY (ID)\n"+
                ");";
    
    conn.query(sql, function (error, results, fields){
        if(error) return console.log(error);
        console.log('criou a tabela!');
    });
}

function addRows(conn){
  const sql = "INSERT INTO Pedidos(Item,Preço,Recebido) VALUES ?";
  const values = [
        ['Batata Frita', '4,50 R$', "Não"],
        ['Hamburguer', '9,80 R$', "Não"]
      ];
  conn.query(sql, [values], function (error, results, fields){
          if(error) return console.log(error);
          console.log('adicionou registros!');
          conn.end();//fecha a conexão
      });
}