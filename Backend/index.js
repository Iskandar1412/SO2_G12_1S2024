const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const mysql = require('mysql2');
const cors = require('cors'); 

const app = express();
const server = http.createServer(app);
const io = socketIO(server);


app.use(cors());

// Configuración MySQL
const db = mysql.createConnection({
    host: '172.17.0.2',
    user: 'root',
    password: 'iskandar',
    database: 'SOPES'
});

// Conexión DB
db.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
        return;
    }
    console.log('Conexión exitosa a la base de datos MySQL');
});

// Configurar Socket.IO
io.on('connection', (socket) => {
    console.log('Cliente conectado');
    
    // Consultar DB
    db.query('SELECT * FROM SOPES', (err, rows) => {
        if (err) {
            console.error('Error al ejecutar la consulta:', err);
            return;
        }
        // Envio de datos
        socket.emit('data', rows);
    });

    // Desconectar
    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

// Iniciar el servidor HTTP
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Servidor HTTP en el puerto ${PORT}`);
});
