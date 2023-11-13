const { Router } = require('express');
const router = Router();
const mysql = require('mysql');
// se crea la conexión a mysql
const connection = mysql.createPool({
    connectionLimit: 500,
    host: 'localhost',
    user: 'root',
    password: 'root', //el password de ingreso a mysql
    database: 'proyectoIoT',
    port: 3306
});
connection.on('error', function(err) {
    console.log("[mysql error]",err);
  });
//function GET para todos los datos
router.get('/parqueadero/laser', (req, res) => {
    var json1 = {}; 
    var arreglo = []; 
    connection.getConnection(function (error, tempConn) { 
        if (error) {
            throw error; 
        }
        else {
            console.log('Conexion correcta.');
            tempConn.query('SELECT * FROM barrera_laser', function (error, result) {
                var resultado = result; 
                if (error) {
                    throw error;
                } else {
                    tempConn.release(); 
                    for (i = 0; i < resultado.length; i++) { 
                        json1 = {
                            "id": resultado[i].id,
                            "led_id": resultado[i].led_id, 
                            "nivel_luz": resultado[i].nivel_luz,
                            "fechahora": resultado[i].fechahora,
                        };
                        console.log(json1); 
                        arreglo.push(json1); 
                    }
                    res.json(arreglo);
                }
            });
        }
    });
});
//función POST para almacenar datos
router.post('/parqueadero/laser', (req, res) => {
    console.log(req.body); 
    json1 = req.body; 
    connection.getConnection(function (error, tempConn) { 
        if (error) {
            throw error;
        }
        else {
            console.log('Conexion correcta.');
            tempConn.query('INSERT INTO barrera_laser VALUES(null,?,?,?)',
                [json1.led_id, json1.nivel_luz, json1.fechahora], function
                (error, result) { 
                if (error) {
                    res.send("error al ejecutar el query");
                } else {
                    tempConn.release();
                    res.send("datos almacenados"); 
                }
            });
        }
    });
});
module.exports = router;