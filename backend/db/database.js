const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./ahorcado.db');

db.serialize(() => {
  // Tabla para partidas
  db.run(`
    CREATE TABLE IF NOT EXISTS partidas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      jugador1 TEXT,
      jugador2 TEXT,
      ganador TEXT,
      rondas INTEGER,
      tiempo INTEGER,
      fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

module.exports = db;