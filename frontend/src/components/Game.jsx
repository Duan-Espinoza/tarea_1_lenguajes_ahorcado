import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Game() {
  const [jugadores, setJugadores] = useState({ jugador1: '', jugador2: '' });
  const [partida, setPartida] = useState(null);

  const iniciarPartida = async () => {
    const response = await axios.post('http://localhost:5000/api/game/nueva-partida', jugadores);
    setPartida(response.data);
  };

  return (
    <div>
      <input 
        placeholder="Jugador 1" 
        onChange={(e) => setJugadores({ ...jugadores, jugador1: e.target.value })}
      />
      <input 
        placeholder="Jugador 2" 
        onChange={(e) => setJugadores({ ...jugadores, jugador2: e.target.value })}
      />
      <button onClick={iniciarPartida}>Iniciar</button>
      
      {partida && (
        <div>
          <p>Turno: {partida.jugadores[0]}</p>
          <p>Palabra: {partida.palabras[0].replace(/./g, '_ ')}</p>
        </div>
      )}
    </div>
  );
}

export default Game;