import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HangmanDrawing from './HangmanDrawing';  // Asegúrate de crear este componente
import Keyboard from './Keyboard';  // Asegúrate de crear este componente

function Game() {
  // Estados existentes
  const [jugadores, setJugadores] = useState({ jugador1: '', jugador2: '' });
  const [partida, setPartida] = useState(null);

  // Nuevos estados para la lógica del juego
  const [letrasAdivinadas, setLetrasAdivinadas] = useState([]);
  const [errores, setErrores] = useState(0);

  // Calcula la palabra actual y la palabra mostrada
  const palabraActual = partida?.palabras[partida.ronda % 2];
  const palabraMostrada = palabraActual
    ?.split('')
    .map((letra) => (letrasAdivinadas.includes(letra) ? letra : '_'))
    .join(' ');

  // Función para manejar adivinanzas
  const adivinarLetra = (letra) => {
    if (!letrasAdivinadas.includes(letra)) {
      const nuevasLetras = [...letrasAdivinadas, letra];
      setLetrasAdivinadas(nuevasLetras);
      
      if (!palabraActual?.includes(letra)) {
        setErrores(prev => prev + 1);
      }
    }
  };

  // Efecto para cambiar de ronda o finalizar el juego
  useEffect(() => {
    if (palabraActual && palabraActual.split('').every(letra => letrasAdivinadas.includes(letra))) {
      // Lógica para cambiar de ronda o terminar
    }
  }, [letrasAdivinadas]);

  // Función para iniciar partida (existente)
  const iniciarPartida = async () => {
    const response = await axios.post('http://localhost:5000/api/game/nueva-partida', jugadores);
    setPartida(response.data);
    setLetrasAdivinadas([]);  // Resetear al iniciar nueva partida
    setErrores(0);
  };

  return (
    <div className="game-container">
      {/* Inputs y botón de inicio */}
      <input 
        placeholder="Jugador 1" 
        onChange={(e) => setJugadores({ ...jugadores, jugador1: e.target.value })}
      />
      <input 
        placeholder="Jugador 2" 
        onChange={(e) => setJugadores({ ...jugadores, jugador2: e.target.value })}
      />
      <button onClick={iniciarPartida}>Iniciar</button>

      {/* Sección del juego */}
      {partida && (
        <div>
          <HangmanDrawing errors={errores} />
          <div className="hangman-section">
            <p>Turno: {partida.jugadores[partida.ronda % 2]}</p>
            <p>Palabra: {palabraMostrada}</p>
            <p>Errores: {errores}/6</p>
            <Keyboard 
              onKeyPress={adivinarLetra}
              disabledLetters={letrasAdivinadas}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Game;