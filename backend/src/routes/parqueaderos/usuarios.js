const { Router } = require('express');
const router = Router();
const mysql = require('mysql');
// Conexión para MySQL
const connection = mysql.createPool({
    connectionLimit: 500,
    host: 'localhost',
    user: 'root',
    password: 'root', //el password de ingreso a mysql
    database: 'proyectoIoT',
    port: 3306
});

connection.on('error', function (err) {
    console.log("[mysql error]", err);
});
//Metodo GET para TODOS LOS USUARIOS
router.get('/parqueadero/usuarios', (req, res) => {
    var json1 = {}; 
    var arreglo = []; 
    connection.getConnection(function (error, tempConn) { 
        if (error) {
            throw error; 
        }
        else {
            console.log('Conexion correcta.');
            tempConn.query('SELECT * FROM usuarios_parqueadero', function (error, result) {
                var resultado = result; 
                if (error) {
                    throw error;
                } else {
                    tempConn.release(); 
                    for (i = 0; i < resultado.length; i++) { 
                        json1 = {
                            "id": resultado[i].id,
                            "usuario": resultado[i].usuario,
                            "nombre": resultado[i].nombre,
                            "tipo": resultado[i].tipo,
                            "contraseña": resultado[i].contraseña,
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
//Metodo POST para CREAR UN USUARIO
router.post('/parqueadero/usuarios', (req, res) => {
    console.log(req.body); 
    json1 = req.body; 
    connection.getConnection(function (error, tempConn) { 
        if (error) {
            throw error; 
        }
        else {
            console.log('Conexion correcta.');
            tempConn.query('INSERT INTO usuarios_parqueaderos VALUES(null,?,?,?,?)',
                [json1.usuario, json1.nombre, json1.tipo, json1.contraseña], function
                (error, result) { 
                if (error) {
                    res.send("error al ejecutar el query");
                } else {
                    tempConn.release();
                    res.status(201);
                    res.send("Datos almacenados"); 
                }
            });
        }
    });
});
//Metodo GET para BUSCAR UN USUARIO dado el parametro user
router.get('/parquedero/usuarios/:user', (req, res) => {
    var json1 = {}; 
    var buscado = req.params.user;
    connection.getConnection(function (error, tempConn) { 
        if (error) {
            throw error; 
        }
        else {
            console.log('Conexion correcta.');
            tempConn.query('SELECT * FROM usuarios_parqueadero WHERE usuario=?', [buscado], function (error, result) {
                var resultado = result;
                console.log(result) 
                if (error) {
                    res.send("Error al ejecutar el query");
                } else {
                    if (resultado.length === 0) {
                        res.status(418);
                        res.send("No user found");
                    }
                    else {
                        tempConn.release();
                        json1 = {
                            "id": resultado[0].id,
                            "usuario": resultado[0].usuario,
                            "nombre": resultado[0].nombre,
                            "tipo": resultado[0].tipo,
                            "contraseña": resultado[0].contraseña,
                        };
                        res.send(json1);
                    } 
                }
            });
        }
    });
});
//Metodo GET para VALIDAR UN USUARIO dado el parametro user, password
router.get('/parqueadero/usuarios/:user/:password', (req, res) => {
    var json1 = {}; 
    var userBuscado = req.params.user
    var passBuscado = req.params.password
    connection.getConnection(function (error, tempConn) { 
        if (error) {
            throw error; 
        }
        else {
            console.log('Conexion correcta.');
            tempConn.query('SELECT * FROM usuarios_parqueadero WHERE usuario = ?', [userBuscado], function (error, result) {
                var resultado = result; 
                if (error) {
                    res.send("Error al ejecutar el query");
                } else {
                    if (resultado.length === 0) {
                        res.status(418);
                        res.send("No user found");
                    }
                    else {
                        tempConn.release(); 
                        json1 = {
                            "id":resultado[0].id,
                            "usuario": resultado[0].usuario,
                            "nombre": resultado[0].nombre,
                            "tipo": resultado[0].tipo,
                            "contraseña": resultado[0].contraseña,
                        };
                        if (passBuscado === json1.contraseña) {
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
router.post('/parqueadero/usuarios/:user', (req, res) => {
    var json1 = {}; 
    var buscado = req.params.user;
    var json2 = req.body;
    connection.getConnection(function (error, tempConn) { 
        if (error) {
            throw error; 
        }
        else {
            console.log('Conexion correcta.');
            tempConn.query('SELECT * FROM usuarios_parqueadero WHERE user = ?', [buscado], function (error, result) {
                var resultado = result; 
                if (error) {
                    res.send("Error al ejecutar el query");
                } else {
                    tempConn.release(); 
                    if (resultado.length === 0) {
                        res.status(418);
                        res.send("No user found");
                    }
                    else {
                        json1 = {
                            "id": resultado[0].id,
                            "usuario": resultado[0].usuario,
                            "nombre": resultado[0].nombre,
                            "tipo": resultado[0].tipo,
                            "contraseña": resultado[0].contraseña,
                        };
                        console.log("Antes del update:");
                        console.log(json1);
                        tempConn.query('UPDATE usuarios SET id=?, usuario=?, nombre=?, tipo=?, contraseña=? WHERE user=?',
                            [json1.id, json2.usuario, json2.nombre, json2.tipo, json2.contraseña, buscado],
                            function (error, result) {
                                if (error) {
                                    res.send("error al ejecutar el query");
                                } else {
                                    tempConn.release();
                                    res.send("datos actualizados"); //mensaje de respuesta
                                }
                            }
                        );
                    } 
                }
            });
        }
    });
});
module.exports = router;
