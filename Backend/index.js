// npm install express socket.io mysql

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mysql = require('mysql');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const db = mysql.createConnection({
    host: '172.17.0.2',
    user: 'root',
    password: 'iskandar',
    database: 'SOPES'
});


db.connect(err => {
    if (err) {
        throw err;
    }
    console.log('Conectado a la base de datos MySQL');
});

// Configuración Socket.IO
io.on('connection', socket => {
    console.log('Cliente conectado');
});

const query = db.query('SELECT * FROM SOPES');
query.on('result', row => {
    io.emit('dataUpdate', row); 
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor backend escuchando en el puerto ${PORT}`);
});
