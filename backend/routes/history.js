const express = require('express');
const router = express.Router();
const db = require('../db/database');

// Obtener historial de partidas
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

// Guardar nueva partida
router.post('/', (req, res) => {
  const { 
    jugador1,
    jugador2,
    ganador,
    rondas,
    tiempo,
    tiempos_jugador1 = 0,    // Valor por defecto si no se envía
    tiempos_jugador2 = 0,     // Valor por defecto si no se envía
    rondas_completadas_jugador1 = 0,  // Valor por defecto si no se envía
    rondas_completadas_jugador2 = 0   // Valor por defecto si no se envía
  } = req.body;

  // Validación mejorada
  if (!jugador1 || !jugador2 || !rondas || !tiempo) {
    return res.status(400).json({ error: 'Datos obligatorios faltantes' });
  }

  // Query actualizada con nuevos campos
  db.run(
    `INSERT INTO partidas (
      jugador1, 
      jugador2, 
      ganador, 
      rondas, 
      tiempo,
      tiempos_jugador1,
      tiempos_jugador2,
      rondas_completadas_jugador1,
      rondas_completadas_jugador2
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      jugador1,
      jugador2,
      ganador,
      rondas,
      tiempo,
      tiempos_jugador1,
      tiempos_jugador2,
      rondas_completadas_jugador1,
      rondas_completadas_jugador2
    ],
    function(err) {
      if (err) {
        console.error('Error al guardar partida:', err.message);
        return res.status(500).json({ 
          error: 'Error al guardar en la base de datos',
          detalle: err.message 
        });
      }
      
      res.status(201).json({
        id: this.lastID,
        jugador1,
        jugador2,
        tiempo_total: tiempo,
        mensaje: 'Partida registrada exitosamente'
      });
    }
  );
});

module.exports = router;