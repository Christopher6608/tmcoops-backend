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

app.post('/usuarios/registro', (req, res) => {
    const { nombre, email } = req.body;
    db.query('INSERT INTO usuarios (nombre, email) VALUES (?, ?)', [nombre, email], (err) => {
        if (err) return res.status(500).json(err);
        res.status(201).json({ message: 'Usuario creado' });
    });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
