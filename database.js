const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Crea el archivo de base de datos en la raíz
const dbPath = path.resolve(__dirname, 'todos.db');
const db = new sqlite3.Database(dbPath);

// Inicializar tabla
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS todos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
});

// Exportar funciones envueltas en Promesas (Async/Await ready)
module.exports = {
    all: () => {
        return new Promise((resolve, reject) => {
            db.all("SELECT * FROM todos ORDER BY id DESC", [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    },
    insert: (title) => {
        return new Promise((resolve, reject) => {
            db.run("INSERT INTO todos (title) VALUES (?)", [title], function(err) {
                if (err) reject(err);
                else resolve({ id: this.lastID, title });
            });
        });
    },
    delete: (id) => {
        return new Promise((resolve, reject) => {
            db.run("DELETE FROM todos WHERE id = ?", [id], function(err) {
                if (err) reject(err);
                else resolve();
            });
        });
    }
};
