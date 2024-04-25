/*
( ```
npm install express socket.io mysql cors mysql2
```)
*/


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
// const db = mysql.createPool({
//     connectionLimit: 10, 
//     host: '172.17.0.2',
//     user: 'root',
//     password: 'iskandar',
//     database: 'SOPES'
// });

const db = mysql.createPool({
    connectionLimit: 10, 
    host: 'database-1.c5kseoemwdnm.us-east-1.rds.amazonaws.com',
    user: 'admin',
    password: 'iskandar1412',
    database: 'SOPES'
});

// Consulta DB
function fetchDataFromDB() {
    return new Promise((resolve, reject) => {
        db.query('SELECT * from SOPES ORDER BY id DESC LIMIT 1200;', (err, rows) => {
            if (err) {
                console.error('Error al ejecutar la consulta:', err);
                reject(err);
                return;
            }
            resolve(rows);
        });
    });
}



// Conexion de Socket
io.on('connection', (socket) => {
    console.log('Cliente conectado');

    // Emitir datos cada segundo
    const intervalId = setInterval(async () => {
        try {
            const data = await fetchDataFromDB();
            socket.emit('data', data);
        } catch (err) {
            console.error('Error al obtener datos de la DB:', err);
            socket.emit('error', 'Error al obtener datos');
        }
    }, 1000); // intervalo de un segundo

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Servidor HTTP en el puerto ${PORT}`);
});
