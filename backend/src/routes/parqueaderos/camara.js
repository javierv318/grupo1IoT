const { Router } = require('express');
const router = Router();
const mysql = require('mysql');
// se crea la conexión a mysql
const connection = mysql.createPool({
    connectionLimit: 500,
    host: 'localhost',
    user: 'root',
    password: '', //el password de ingreso a mysql
    database: 'iotdatos',
    port: 3306
});
connection.on('error', function(err) {
    console.log("[mysql error]",err);
  });
//function GET para todos los registros
router.get('/parqueadero/camara', (req, res) => {
    var json1 = {}; 
    var arreglo = []; 
    connection.getConnection(function (error, tempConn) { //conexion a mysql
        if (error) {
            throw error; 
        }
        else {
            console.log('Conexion correcta.');
            tempConn.query('SELECT * FROM control_acceso', function (error, result) {
                var resultado = result; 
                if (error) {
                    throw error;
                } else {
                    tempConn.release(); 
                    for (i = 0; i < resultado.length; i++) { 
                        json1 = {
                            "id": resultado[i].id,
                            "fechahora": resultado[i].fechahora, 
                            "placa": resultado[i].placa,
                        }; 
                        arreglo.push(json1); 
                    }
                    res.json(arreglo); //se retorna el arreglo
                }
            });
        }
    });
});
//function GET para verificar un VEHICULO
router.get('/parqueadero/camara/:placa', (req, res) => {
    var placaBuscada = req.params.placa;
    var json1 = {}; 
    connection.getConnection(function (error, tempConn) { //conexion a mysql
        if (error) {
            throw error; 
        }
        else {
            console.log('Conexion correcta.');
            tempConn.query('SELECT * FROM vehiculo_permitido WHERE placa_vehiculo = ?',[placaBuscada], function (error, result) {
                var resultado = result; //se almacena el resultado de la consulta en la variable resultado
                if (error) {
                    throw error;
                } else {
                    if (resultado.length === 0) {
                        res.status(418);
                        res.send("No user found");
                    }
                    else {
                        tempConn.release();
                        json1 = {
                            "id": resultado[i].id,
                            "nombre_titular":resultado[i].nombre_titular,
                            "apellido_titular":resultado[i].apellido_titular,
                            "marca_vehiculo":resultado[i].marca_vehiculo,
                            "color_vehiculo":resultado[i].color_vehiculo,
                            "placa_vehiculo":resultado[i].placa_vehiculo
                        };
                        res.send(json1);
                    }
                }
            });
        }
    });
});
//función POST para crear un registro
router.post('/parqueadero/camara/:tipo', (req, res) => {
    var tipo = req.params.tipo;
    var json1 = req.body; 
    connection.getConnection(function (error, tempConn) { 
        if (error) {
            throw error; 
        }
        else {
            console.log('Conexion correcta.');
            if(tipo === 1){
                tempConn.query('INSERT INTO control_acceso VALUES(null,?,?)',
                    [json1.fechahora, json1.placa], function
                    (error, result) {
                    if (error) {
                        res.send("error al ejecutar el query");
                    } else {
                        tempConn.release();
                        res.send("datos almacenados");
                    }
                });
            }
            else{
                tempConn.query('INSERT INTO vehiculo_permitido VALUES(null,?,?,?,?,?)',
                [json1.nombre_titular, json1.apellido_titular,json1.marca_vehiculo, json1.color_vehiculo,json1.placa_vehiculo], function
                (error, result) { 
                if (error) {
                    res.send("error al ejecutar el query");
                } else {
                    tempConn.release();
                    res.send("datos almacenados"); 
                }
            });
            }
            
        }
    });
});
module.exports = router;