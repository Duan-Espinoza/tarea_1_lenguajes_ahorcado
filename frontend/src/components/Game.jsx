import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HangmanDrawing from './HangmanDrawing';
import Keyboard from './Keyboard';
import './Game.css';

function Game() {
  const [jugadores, setJugadores] = useState({ jugador1: '', jugador2: '' });
  const [partida, setPartida] = useState(null);
  const [letrasAdivinadas, setLetrasAdivinadas] = useState([]);
  const [errores, setErrores] = useState(0);
  const [mensajeFinal, setMensajeFinal] = useState('');

  // Obtener palabra actual y mostrar progreso
  const palabraActual = partida?.palabras[partida.ronda % 2];
  const palabraMostrada = palabraActual?.split('')
    .map(letra => letrasAdivinadas.includes(letra) ? letra : '_ ')
    .join('');

  // Lógica de desempate
  const determinarGanador = () => {
    const jugador1 = partida.jugadores[0];
    const jugador2 = partida.jugadores[1];
    
    // Si un jugador completó más rondas
    if (partida.rondasCompletadas[jugador1] > partida.rondasCompletadas[jugador2]) return jugador1;
    if (partida.rondasCompletadas[jugador2] > partida.rondasCompletadas[jugador1]) return jugador2;
    
    // Si empatan en rondas, comparar tiempo
    return partida.tiempos[jugador1] < partida.tiempos[jugador2] ? jugador1 : jugador2;
  };

  // Efecto para controlar fin de ronda/juego
  useEffect(() => {
    if (palabraActual && palabraActual.split('').every(letra => letrasAdivinadas.includes(letra))) {
      const nuevoEstado = { ...partida };
      
      // Registrar tiempo y rondas completadas
      const jugadorActual = partida.jugadores[partida.ronda % 2];
      nuevoEstado.tiempos[jugadorActual] = (Date.now() - partida.tiempoInicio) / 1000;
      nuevoEstado.rondasCompletadas[jugadorActual] = (nuevoEstado.rondasCompletadas[jugadorActual] || 0) + 1;

      if (partida.ronda < 1) { // Cambiar de ronda (0-indexed)
        nuevoEstado.ronda += 1;
        setLetrasAdivinadas([]);
        setErrores(0);
        setPartida(nuevoEstado);
      } else { // Finalizar juego
        const ganador = determinarGanador();
        setMensajeFinal(ganador ? `¡Ganó ${ganador}!` : '¡Empate!');
        
        // Guardar en historial
        axios.post('http://localhost:5000/api/history', {
          jugador1: partida.jugadores[0],
          jugador2: partida.jugadores[1],
          ganador,
          rondas: 2,
          tiempo: (Date.now() - partida.tiempoInicio) / 1000
        });
        
        // Reiniciar juego después de 5 segundos
        setTimeout(() => {
          setPartida(null);
          setMensajeFinal('');
        }, 5000);
      }
    }
  }, [letrasAdivinadas]);

  // Iniciar nueva partida
  const iniciarPartida = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/game/nueva-partida', jugadores);
      setPartida({
        ...response.data,
        tiempos: {},
        rondasCompletadas: {},
        tiempoInicio: Date.now()
      });
      setLetrasAdivinadas([]);
      setErrores(0);
    } catch (error) {
      console.error('Error al iniciar partida:', error);
    }
  };

  return (
    <div className="game-container">
      {!partida && (
        <div className="configuracion">
          <input
            placeholder="Jugador 1"
            onChange={(e) => setJugadores({ ...jugadores, jugador1: e.target.value })}
          />
          <input
            placeholder="Jugador 2"
            onChange={(e) => setJugadores({ ...jugadores, jugador2: e.target.value })}
          />
          <button onClick={iniciarPartida}>Iniciar Partida</button>
        </div>
      )}

      {partida && (
        <div className="juego-activo">
          <HangmanDrawing errors={errores} />
          
          <div className="estado-juego">
            <h3>Turno: {partida.jugadores[partida.ronda % 2]}</h3>
            <div className="palabra">{palabraMostrada}</div>
            <p>Intentos restantes: {6 - errores}</p>
          </div>

          <Keyboard
            onKeyPress={(letra) => adivinarLetra(letra.toLowerCase())}
            disabledLetters={letrasAdivinadas}
          />
        </div>
      )}

      {mensajeFinal && (
        <div className="resultado-final">
          <h2>{mensajeFinal}</h2>
          <p>Redirigiendo al menú principal...</p>
        </div>
      )}
    </div>
  );
}

export default Game;