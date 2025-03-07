const express = require('express');
const cors = require('cors');
const app = express();
const gameRoutes = require('./routes/game');
const historyRoutes = require('./routes/history');

app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/game', gameRoutes);
app.use('/api/history', historyRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend en http://localhost:${PORT}`);
});