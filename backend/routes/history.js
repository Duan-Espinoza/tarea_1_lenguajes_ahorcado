const express = require('express');
const router = express.Router();
const db = require('../db/database'); // Importar la conexión a la base de datos

// Obtener todo el historial de partidas
router.get('/', (req, res) => {
  db.all(
    'SELECT * FROM partidas ORDER BY fecha DESC',
    (err, rows) => {
      if (err) {
        console.error('Error al obtener historial:', err.message);
        return res.status(500).json({ error: 'Error del servidor' });
      }
      res.json(rows);
    }
  );
});

// Guardar nueva partida en el historial
router.post('/', (req, res) => {
  const { jugador1, jugador2, ganador, rondas, tiempo } = req.body;

  // Validación básica
  if (!jugador1 || !jugador2 || !rondas || !tiempo) {
    return res.status(400).json({ error: 'Datos incompletos' });
  }

  db.run(
    `INSERT INTO partidas 
      (jugador1, jugador2, ganador, rondas, tiempo) 
      VALUES (?, ?, ?, ?, ?)`,
    [jugador1, jugador2, ganador, rondas, tiempo],
    function(err) {
      if (err) {
        console.error('Error al guardar partida:', err.message);
        return res.status(500).json({ error: 'Error al guardar partida' });
      }
      
      res.status(201).json({
        id: this.lastID,
        mensaje: 'Partida guardada exitosamente'
      });
    }
  );
});

module.exports = router;