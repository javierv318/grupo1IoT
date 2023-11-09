const express = require('express');
const mysql = require('mysql');

const app = express();

const baseUrl = '/GR1/controlAcceso/'

// Habilitar json parser de express
app.use(express.json());

//Configuracion Conexion
const connection = mysql.createConnection({
    user: 'EdificioIotBDAdmin',
    password: 'IOT#$#@#Admin',
    database: 'EdificioIOT',
    host: 'localhost'
});

// Crear conexion
connection.connect();


// REST CONTROL ACCESO

//Agrega registro de vehiculo en entrada
app.post(baseUrl+'addRegistro', (request, response) => {

    console.log("DEBUG addRegistro: Incoming POST", request.body);
    const registro = {
        timeStamp : Number(request.body.timeStamp),
        placa : String(request.body.placa)
    };

    let mysqlResponse = ''

    agregar_ingreso(registro, function(result){
        mysqlResponse = result;

        response.json(mysqlResponse);
    });
});

//Agrega vehiculo permitido a la BD
app.post(baseUrl+'addVehiculo', (request, response) => {
    console.log("DEBUG : Incoming POST", request.body);
    const registro = {
        nombreTitular : string(request.body.nombreTitular),
        apellidoTitular : string(request.body.apellidoTitular),
        marcaVehiculo : string(request.body.marcaVehiculo),
        colorVehiculo : string(request.body.colorVehiculo),
        placa : string(request.body.placa)
    }

    let mysqlResponse = ''
    
    agregar_autorizado(registro, function(result){
        mysqlResponse = result;
        response.json(mysqlResponse);
    });

});

app.get(baseUrl+'verificarPlaca/:placa', (request, response) => {
    placaEnviada = string(request.params.placa);

    let mysqlResponse = ''

    verificar_placa(placaEnviada, function(result){
        mysqlResponse = result;
        // TODO : Devolver verdadero o falso segun corresponda, no enviar la respuesta de mysql
        response.json(mysqlResponse);
    });

});

app.get(baseUrl+'Registros', (request, response) => {
    
    let mysqlResponse = ''
    
    recuperar_registros(function(result){
        mysqlResponse = result;
        response.json(mysqlResponse);
    });
});

// FUNs Mysql INGRESO
function agregar_ingreso(registro, callback){
    let querie = `INSERT INTO GR1_control_acceso (timestamp, placa) VALUES (${registro.timeStamp},${registro.placa})`;

    connection.query(querie, (err, res) => {
        if (err) throw err;

        return callback(JSON.stringify(res));
    });
}

function agregar_autorizado(registro, callback){
    let querie = `INSERT INTO GR1_vehiculo_permitido (nombre_titular, apellido_titular, marcha_vehiculo, color_vehiculo, placa_vechiulo) VALUES (${registro.nombreTitular},${registro.apellidoTitular},${registro.marcaVehiculo},${registro.colorVehiculo},${registro.placa})`;

    connection.query(querie, (err, res) => {
        if (err) throw err;

        return callback(JSON.stringify(res));
    });
}

function verificar_placa(placa, callback){
    let querie = `SELECT * FROM GR1_vehiculo_permitido WHERE placa_vechiulo = ${placa}`;

    connection.query(querie, (err, res) => {
        if (err) throw err;

        return callback(JSON.stringify(res));
    });

}

function recuperar_registros(callback){
    let querie = `SELECT * FROM GR1_control_acceso`;

    connection.query(querie, (err, res) => {
        if (err) throw err;

        return callback(JSON.stringify(res));
    });

}



// REST CONTROL PARQUEO


// REALIZAR

// Inicializacion servidor
const PORT = 3001;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});