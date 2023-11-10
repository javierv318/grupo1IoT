DROP DATABASE EdificioIOT;

CREATE DATABASE EdificioIOT;
use EdificioIOT;

CREATE TABLE control_acceso(
    id INT AUTO_INCREMENT, 
    fechahora INT, 
    placa VARCHAR(8),
    PRIMARY KEY(id)
);

CREATE TABLE vehiculo_permitido(
    id INT AUTO_INCREMENT, 
    nombre_titular VARCHAR(64),
    apellido_titular VARCHAR(64), 
    marcha_vehiculo VARCHAR(64), 
    color_vehiculo VARCHAR(64), 
    placa_vechiulo VARCHAR(64) NOT NULL,
    PRIMARY KEY(id), 
    CONSTRAINT UNQ_Placa UNIQUE(placa_vechiulo)
);

CREATE TABLE historial_acceso(
    id INT AUTO_INCREMENT, 
    id_evento INT, 
    autorizado TINYINT(1),
    autorizo VARCHAR(64), 
    PRIMARY KEY (id), 
    FOREIGN KEY (id_evento) REFERENCES GR1_control_acceso(id)
);

CREATE TABLE barrera_laser(
    id INT AUTO_INCREMENT,
    led_id INT(2),
    nivel_luz INT(2),
    fechahora INT(11),
    PRIMARY KEY(id)
);

CREATE TABLE usuarios_parqueadero(
    id INT AUTO_INCREMENT,
    usuario VARCHAR(64), 
    nombre VARCHAR(64),
    tipo TINYINT(1),
    contraseña VARCHAR(64),
    PRIMARY KEY(id), 
);