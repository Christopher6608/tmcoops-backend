// Agrega esto justo después de db.connect en tu archivo index.js en GitHub
db.connect(err => {
    if (err) {
        console.error('Error conectando a MySQL:', err);
    } else {
        console.log('¡Conectado! Creando tabla...');
        const sql = `CREATE TABLE IF NOT EXISTS usuarios (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nombre VARCHAR(100),
            email VARCHAR(100) UNIQUE,
            password VARCHAR(255)
        )`;
        db.query(sql, (err) => {
            if (err) console.error('Error al crear tabla:', err);
            else console.log('Tabla "usuarios" lista con campo password 🚀');
        });
    }
});

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'mysql-168ef84a-christopher06062008-cb96.e.aivencloud.com',
    port: 16771,
    user: 'avnadmin',
    password: process.env.DB_PASSWORD, 
    database: 'defaultdb',
    ssl: { rejectUnauthorized: false }
});

db.connect(err => {
    if (err) {
        console.error('Error conectando a MySQL:', err);
    } else {
        console.log('¡Conectado exitosamente a Aiven MySQL! 🚀');
    }
});

app.get('/', (req, res) => res.send('Servidor TMCOOPS funcionando 🚀'));

app.get('/usuarios', (req, res) => {
    db.query('SELECT * FROM usuarios', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// Registrar usuario (Actualizado con password)
app.post('/usuarios/registro', (req, res) => {
    const { nombre, email, password } = req.body;
    db.query('INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)', 
    [nombre, email, password], (err) => {
        if (err) return res.status(500).json(err);
        res.status(201).json({ message: 'Usuario creado con éxito' });
    });
});


const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
