const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// CONFIGURACIÓN DE TU AIVEN MYSQL (Copia de la consola de Aiven)
const db = mysql.createConnection({
    host: 'TU_HOST_DE_AIVEN', 
    port: 16773, 
    user: 'avnadmin',
    password: 'TU_PASSWORD_DE_AIVEN',
    database: 'defaultdb',
    ssl: { rejectUnauthorized: false }
});

db.connect(err => {
    if (err) console.error('Error conectando a MySQL:', err);
    else console.log('Conectado a Aiven MySQL');
});

// Ruta de prueba
app.get('/', (req, res) => res.send('Servidor TMCOOPS funcionando 🚀'));

// Obtener usuarios
app.get('/usuarios', (req, res) => {
    db.query('SELECT * FROM usuarios', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// Registrar usuario
app.post('/usuarios/registro', (req, res) => {
    const { nombre, email } = req.body;
    db.query('INSERT INTO usuarios (nombre, email) VALUES (?, ?)', [nombre, email], (err) => {
        if (err) return res.status(500).json(err);
        res.status(201).json({ message: 'Usuario creado' });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));