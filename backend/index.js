// 1. Importar módulos necesarios
const express = require('express');
const cors = require('cors');
const http = require('http'); // Módulo para crear el servidor HTTP
const socketIO = require('socket.io'); // Módulo para Socket.IO

// 2. Configurar Express
const app = express();
const gameRoutes = require('./routes/game');
const historyRoutes = require('./routes/history');

// 3. Middlewares
app.use(cors());
app.use(express.json());

// 4. Rutas
app.use('/api/game', gameRoutes);
app.use('/api/history', historyRoutes);

// 5. Crear servidor HTTP con Express
const server = http.createServer(app); 

// 6. Configurar Socket.IO (¡ESTA ES LA PARTE NUEVA!)
const io = socketIO(server, {
  cors: {
    origin: "http://localhost:3000", // Permitir conexiones del frontend
    methods: ["GET", "POST"]
  }
});

// 7. Manejar conexiones de Socket.IO
io.on('connection', (socket) => {
  console.log('🔌 Cliente conectado:', socket.id);

  socket.on('adivinar-letra', (data) => {
    console.log('Letra recibida:', data);
    // Validar lógica de juego aquí si es necesario
    io.emit('actualizar-juego', data); // Enviar a todos los clientes
  });

  socket.on('disconnect', () => {
    console.log('❌ Cliente desconectado:', socket.id);
  });
});

// 8. Iniciar servidor (IMPORTANTE: usar server.listen en lugar de app.listen)
const PORT = 5000;
server.listen(PORT, () => {
  console.log(`🚀 Backend en http://localhost:${PORT}`);
});