const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mysql = require('mysql2');
const cors = require('cors'); 

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*', 
        methods: ['GET', 'POST'],
    },
});

// Configuración MySQL pool
const db = mysql.createPool({
    connectionLimit: 10, 
    host: '172.17.0.2',
    user: 'root',
    password: 'iskandar',
    database: 'SOPES'
});

// Consulta DB
function fetchDataFromDB(callback) {
    db.query('SELECT * FROM SOPES', (err, rows) => {
        if (err) {
            console.error('Error al ejecutar la consulta:', err);
            callback(err, null);
            return;
        }
        callback(null, rows);
    });
}



// Conexion de Socket
io.on('connection', (socket) => {
    console.log('Cliente conectado');

    fetchDataFromDB((err, data) => {
        if (!err) {
            socket.emit('data', data);
        }
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Servidor HTTP en el puerto ${PORT}`);
});
