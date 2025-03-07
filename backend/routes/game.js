const express = require('express');
const router = express.Router();
const db = require('../db/database');
const palabras = require('../db/palabras.json');

// Iniciar nueva partida
router.post('/nueva-partida', (req, res) => {
  const { jugador1, jugador2 } = req.body;
  const jugadores = [jugador1, jugador2].sort(() => Math.random() - 0.5); // Aleatorizar orden
  const palabraJugador1 = palabras[Math.floor(Math.random() * palabras.length)];
  const palabraJugador2 = palabras[Math.floor(Math.random() * palabras.length)];

  // Guardar en memoria o base de datos temporal (simplificado)
  const partida = {
    jugadores,
    palabras: [palabraJugador1, palabraJugador2],
    rondas: 0,
    tiempoInicio: Date.now(),
  };

  res.json(partida);
});

// Más rutas para manejar turnos y lógica...

module.exports = router;