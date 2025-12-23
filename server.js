const express = require('express');
const db = require('./database');
const app = express();

// Configuración importante para Render
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static('public')); // Servir Frontend
app.use(express.json()); // Entender JSON del cliente

// --- Rutas API ---

// GET: Obtener todas las tareas
app.get('/api/todos', async (req, res) => {
    try {
        const tasks = await db.all();
        res.json(tasks);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// POST: Crear tarea
app.post('/api/todos', async (req, res) => {
    try {
        const { title } = req.body;
        if (!title) return res.status(400).json({ error: 'Título requerido' });
        
        const newTask = await db.insert(title);
        res.status(201).json(newTask);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// DELETE: Borrar tarea
app.delete('/api/todos/:id', async (req, res) => {
    try {
        await db.delete(req.params.id);
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Iniciar Servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});
