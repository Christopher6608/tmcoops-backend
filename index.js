const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();


app.use(cors());
app.use(express.json());

// 1. CONFIGURACIÓN DE LA CONEXIÓN
const db = mysql.createConnection({
    host: 'mysql-168ef84a-christopher06062008-cb96.e.aivencloud.com',
    port: 16771,
    user: 'avnadmin',
    password: process.env.DB_PASSWORD, 
    database: 'defaultdb',
    ssl: { rejectUnauthorized: false }
});

// 2. CONECTAR Y CREAR TABLA
db.connect(err => {
    if (err) {
        console.error('Error conectando a MySQL:', err);
    } else {
        console.log('¡Conectado exitosamente! 🚀');
        const sql = `CREATE TABLE IF NOT EXISTS usuarios (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nombre VARCHAR(100),
            email VARCHAR(100) UNIQUE,
            password VARCHAR(255)
        )`;
        db.query(sql, (err) => {
            if (err) console.error('Error al crear tabla:', err);
            else console.log('Tabla "usuarios" lista.');
        });
    }
});

// 3. RUTAS
app.get('/', (req, res) => res.send('Servidor TMCOOPS funcionando 🚀'));

app.get('/usuarios', (req, res) => {
    db.query('SELECT * FROM usuarios', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

app.post('/usuarios/registro', (req, res) => {
    const { nombre, email, password } = req.body;
    db.query('INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)', 
    [nombre, email, password], (err) => {
        if (err) return res.status(500).json(err);
        res.status(201).json({ message: 'Usuario creado' });
    });
});

// RUTA PARA INICIAR SESIÓN (LOGIN)
app.post('/usuarios/login', (req, res) => {
    const { email, password } = req.body;
    
    // Buscamos al usuario que coincida con email Y password
    db.query('SELECT * FROM usuarios WHERE email = ? AND password = ?', [email, password], (err, results) => {
        if (err) {
            console.error('Error en Login:', err);
            return res.status(500).json({ message: 'Error en el servidor' });
        }
        
        if (results.length > 0) {
            // ¡Usuario encontrado!
            res.status(200).json(results[0]);
        } else {
            // No coincide nada
            res.status(401).json({ message: 'Correo o contraseña incorrectos' });
        }
    });
});

// Ruta para actualizar foto de perfil app.put('/usuarios/foto', (req, res) => { const { email, foto_perfil } = req.body; db.query('UPDATE usuarios SET foto_perfil = ? WHERE email = ?', [foto_perfil, email], (err) => { if (err) return res.status(500).json(err); res.json({ message: 'Foto actualizada' }); }); });

// 4. ARRANCAR
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
