const express = require('express');
const router = express.Router();

// Ejemplo: Obtener historial de partidas
router.get('/', (req, res) => {
  // Aquí podrías obtener los datos de la base de datos
  res.json({ history: [] });
});

module.exports = router;
