DROP DATABASE EdificioIOT;
DROP USER 'EdificioIotBDAdmin';

CREATE DATABASE EdificioIOT;
use EdificioIOT;

CREATE TABLE EdificioIOT.GR1_control_acceso(id INT AUTO_INCREMENT, timestamp INT, placa VARCHAR(8),
PRIMARY KEY(id));

CREATE TABLE EdificioIOT.GR1_vehiculo_permitido(id INT AUTO_INCREMENT, nombre_titular VARCHAR(64),
apellido_titular VARCHAR(64), marcha_vehiculo VARCHAR(64), color_vehiculo VARCHAR(64), placa_vechiulo VARCHAR(64) NOT NULL,
PRIMARY KEY(id), CONSTRAINT UNQ_Placa UNIQUE(placa_vechiulo));

CREATE TABLE EdificioIOT.GR1_historial_acceso(id INT AUTO_INCREMENT, id_evento INT, autorizado TINYINT(1),
autorizo VARCHAR(64), PRIMARY KEY (id), FOREIGN KEY (id_evento) REFERENCES GR1_control_acceso(id));

CREATE TABLE EdificioIOT.GR1_barrera_laser(id int AUTO_INCREMENT,
PRIMARY KEY(id));

CREATE USER 'EdificioIotBDAdmin' IDENTIFIED BY 'IOT#$#@#Admin';

GRANT ALL PRIVILEGES ON EdificioIOT.* to 'EdificioIotBDAdmin';

