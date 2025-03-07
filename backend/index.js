// index.js
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const PORT = 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Almacenamiento en memoria para el historial (puedes persistir en un archivo o BD)
let gameHistory = [];

// Cargar palabras desde un archivo JSON (asegúrate de crear words.json)
let words = [];
try {
  words = JSON.parse(fs.readFileSync('./words.json', 'utf8'));
} catch (error) {
  console.error("Error al leer el archivo de palabras:", error);
}

// Función para obtener una palabra aleatoria
const getRandomWord = () => {
  if (words.length === 0) return "default";
  return words[Math.floor(Math.random() * words.length)];
};

// Endpoint para iniciar partida
app.post('/api/start-game', (req, res) => {
  const { jugador1, jugador2 } = req.body;
  if (!jugador1 || !jugador2) {
    return res.status(400).json({ error: "Se requieren dos nombres de jugador." });
  }
  
  // Seleccionar aleatoriamente quién es el jugador 1 en el turno
  const players = [jugador1, jugador2];
  const randomIndex = Math.floor(Math.random() * 2);
  const firstPlayer = players[randomIndex];
  const secondPlayer = players[1 - randomIndex];

  // Crear objeto de partida inicial
  const game = {
    id: Date.now(),
    jugadores: { primero: firstPlayer, segundo: secondPlayer },
    rondas: [],
    startTime: Date.now()
  };

  // Se asigna una palabra aleatoria a cada jugador
  game.jugadoresPalabra = {
    [firstPlayer]: getRandomWord(),
    [secondPlayer]: getRandomWord()
  };

  // Enviar objeto de partida al frontend
  res.json({ game });
});

// Endpoint para actualizar el resultado de la ronda (ejemplo básico)
app.post('/api/round', (req, res) => {
  const { gameId, jugador, acierto, tiempo } = req.body;
  // Aquí se implementa la lógica para actualizar la ronda actual del juego
  // Este es un ejemplo básico
  // Se debe buscar la partida en gameHistory o en una estructura temporal.
  res.json({ message: "Ronda actualizada" });
});

// Endpoint para finalizar el juego y guardar el historial
app.post('/api/finish-game', (req, res) => {
  const { game, resultado, rondasCompletadas, tiempoTotal } = req.body;
  // Añadir información final a la partida
  const gameResult = {
    ...game,
    resultado,
    rondasCompletadas,
    tiempoTotal,
    finishTime: Date.now()
  };

  gameHistory.push(gameResult);

  // También puedes guardar en un archivo para persistencia
  // fs.writeFileSync('gameHistory.json', JSON.stringify(gameHistory));

  res.json({ message: "Juego finalizado", gameResult });
});

// Endpoint para obtener historial de partidas
app.get('/api/history', (req, res) => {
  res.json({ gameHistory });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
