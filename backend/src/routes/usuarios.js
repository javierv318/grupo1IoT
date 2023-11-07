const { Router } = require('express');
const router = Router();
const mysql = require('mysql');
// se crea la conexión a mysql
const connection = mysql.createPool({
    connectionLimit: 500,
    host: 'localhost',
    user: 'root',
    password: 'root', //el password de ingreso a mysql
    database: 'iotdatos',
    port: 3306
});

connection.on('error', function (err) {
    console.log("[mysql error]", err);
});
//Metodo GET para TODOS LOS USUARIOS
router.get('/usuarios', (req, res) => {
    var json1 = {}; //variable para almacenar cada registro que se lea, en formato json
    var arreglo = []; //variable para almacenar todos los datos, en formato arreglo de json
    connection.getConnection(function (error, tempConn) { //conexion a mysql
        if (error) {
            throw error; //si no se pudo conectar
        }
        else {
            console.log('Conexion correcta.');
            //ejecución de la consulta
            tempConn.query('SELECT * FROM usuarios', function (error, result) {
                var resultado = result; //se almacena el resultado de la consulta en la variable resultado
                if (error) {
                    throw error;
                } else {
                    tempConn.release(); //se librea la conexión
                    for (i = 0; i < resultado.length; i++) { //se lee el resultado y se arma el json
                        json1 = {
                            "user": resultado[i].user,
                            "name": resultado[i].name,
                            "tipo": resultado[i].tipo,
                            "password": resultado[i].password,
                        };
                        console.log(json1); //se muestra el json en la consola
                        arreglo.push(json1); //se añade el json al arreglo
                    }
                    res.json(arreglo); //se retorna el arreglo
                }
            });
        }
    });
});
//Metodo POST para CREAR UN USUARIO
router.post('/usuarios', (req, res) => {
    console.log(req.body); //mustra en consola el json que llego
    json1 = req.body; //se almacena el json recibido en la variable json1
    connection.getConnection(function (error, tempConn) { //conexion a mysql
        if (error) {
            throw error; //en caso de error en la conexion
        }
        else {
            console.log('Conexion correcta.');
            tempConn.query('INSERT INTO usuarios VALUES(?,?,?,?)',
                [json1.user, json1.name, json1.tipo, json1.password], function
                (error, result) { //se ejecuta la inserción
                if (error) {
                    res.send("error al ejecutar el query");
                } else {
                    tempConn.release();
                    res.status(201);
                    res.send("Datos almacenados"); //mensaje de respuesta
                }
            });
        }
    });
});
//Metodo GET para BUSCAR UN USUARIO dado el parametro user
router.get('/usuarios/:user', (req, res) => {
    var json1 = {}; //variable para almacenar cada registro que se lea, en formato json
    var buscado = req.params.user;
    connection.getConnection(function (error, tempConn) { //conexion a mysql
        if (error) {
            throw error; //si no se pudo conectar
        }
        else {
            console.log('Conexion correcta.');
            //ejecución de la consulta
            tempConn.query('SELECT * FROM usuarios WHERE user=?', [buscado], function (error, result) {
                var resultado = result;
                console.log(result) //se almacena el resultado de la consulta en la variable resultado
                if (error) {
                    res.send("Error al ejecutar el query");
                } else {
                    tempConn.release(); //se librea la conexión
                    json1 = {
                        "user": resultado[0].user,
                        "name": resultado[0].name,
                        "tipo": resultado[0].tipo,
                        "password": resultado[0].password,
                    };
                    res.send(json1); //se retorna el json
                }
            });
        }
    });
});
//Metodo GET para VALIDAR UN USUARIO dado el parametro user, password
router.get('/usuarios/:user/:password', (req, res) => {
    var json1 = {}; //variable para almacenar cada registro que se lea, en formato json
    var userBuscado = req.params.user
    var passBuscado = req.params.password
    connection.getConnection(function (error, tempConn) { //conexion a mysql
        if (error) {
            throw error; //si no se pudo conectar
        }
        else {
            console.log('Conexion correcta.');
            //ejecución de la consulta
            tempConn.query('SELECT * FROM usuarios WHERE user = ?', [userBuscado], function (error, result) {
                var resultado = result; //se almacena el resultado de la consulta en la variable resultado
                if (error) {
                    res.send("Error al ejecutar el query");
                } else {
                    if (resultado.length === 0) {
                        res.status(418);
                        res.send("No user found");
                    }
                    else {
                        tempConn.release(); //se librea la conexión
                        json1 = {
                            "user": resultado[0].user,
                            "name": resultado[0].name,
                            "tipo": resultado[0].tipo,
                            "password": resultado[0].password,
                        };
                        if (passBuscado === json1.password) {
                            res.status(200);
                            res.send(json1);
                        }
                        else {
                            res.sendStatus(401);
                        }
                    }
                }
            });
        }
    });
});
//metodo POST para ACTUALIZAR UN USUARIO
router.post('/usuarios/:user', (req, res) => {
    var json1 = {}; //variable para almacenar cada registro que se lea, en formato json
    var buscado = req.params.user;
    var json2 = req.body;
    connection.getConnection(function (error, tempConn) { //conexion a mysql
        if (error) {
            throw error; //si no se pudo conectar
        }
        else {
            console.log('Conexion correcta.');
            //ejecución de la consulta
            tempConn.query('SELECT * FROM usuarios WHERE user = ?', [buscado], function (error, result) {
                var resultado = result; //se almacena el resultado de la consulta en la variable resultado
                if (error) {
                    res.send("Error al ejecutar el query");
                } else {
                    tempConn.release(); //se librea la conexión
                    json1 = {
                        "user": resultado[0].user,
                        "name": resultado[0].name,
                        "tipo": resultado[0].tipo,
                        "password": resultado[0].password,
                    };
                    console.log("Antes del update:");
                    console.log(json1);
                }
            });
            //ejecución del update
            tempConn.query('UPDATE usuarios SET user=?, name=?, tipo=?, password=? WHERE user=?',
                [json2.user, json2.name, json2.tipo, json2.password, buscado],
                function (error, result) {
                    if (error) {
                        res.send("error al ejecutar el query");
                    } else {
                        tempConn.release();
                        res.send("datos actualizados"); //mensaje de respuesta
                    }
                });
        }
    });
});
module.exports = router;
