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
  const [contador, setContador] = useState(5);

  // Efecto para el countdown de redirección
  useEffect(() => {
    if (mensajeFinal) {
      const intervalo = setInterval(() => setContador(prev => prev - 1), 1000);
      const timeout = setTimeout(() => {
        setPartida(null);
        setMensajeFinal('');
        setContador(5);
      }, 5000);

      return () => {
        clearInterval(intervalo);
        clearTimeout(timeout);
      };
    }
  }, [mensajeFinal]);

  // Lógica del juego
  const palabraActual = partida?.palabras[partida.ronda % 2]?.toLowerCase();
  const palabraMostrada = palabraActual?.split('')
    .map(letra => letrasAdivinadas.includes(letra) ? letra : '_ ')
    .join('');

  const determinarGanador = () => {
    const [jugador1, jugador2] = partida.jugadores;
    const rondasJ1 = partida.rondasCompletadas[jugador1] || 0;
    const rondasJ2 = partida.rondasCompletadas[jugador2] || 0;

    if (rondasJ1 !== rondasJ2) return rondasJ1 > rondasJ2 ? jugador1 : jugador2;
    return partida.tiempos[jugador1] < partida.tiempos[jugador2] ? jugador1 : jugador2;
  };

  const adivinarLetra = (letra) => {
    // Normalizar la letra a minúscula
    const letraNormalizada = letra.toLowerCase();
  
    if (!letrasAdivinadas.includes(letraNormalizada)) {
      const nuevasLetras = [...letrasAdivinadas, letraNormalizada];
      setLetrasAdivinadas(nuevasLetras);
      
      // Verificar si la letra NO está en la palabra (comparación en minúsculas)
      if (!palabraActual?.includes(letraNormalizada)) {
        setErrores(prev => prev + 1);
      }
    }
  };

  useEffect(() => {
    if (palabraActual && palabraActual.split('').every(letra => letrasAdivinadas.includes(letra))) {
      const nuevoEstado = { ...partida };
      const jugadorActual = partida.jugadores[partida.ronda % 2];

      nuevoEstado.tiempos[jugadorActual] = (Date.now() - partida.tiempoInicio) / 1000;
      nuevoEstado.rondasCompletadas[jugadorActual] = (nuevoEstado.rondasCompletadas[jugadorActual] || 0) + 1;

      if (partida.ronda < 1) {
        nuevoEstado.ronda += 1;
        setPartida(nuevoEstado);
        setLetrasAdivinadas([]);
        setErrores(0);
      } else {
        const ganador = determinarGanador();
        setMensajeFinal(ganador ? `¡Ganó ${ganador}!` : '¡Empate!');
        axios.post('http://localhost:5000/api/history', {
          jugador1: partida.jugadores[0],
          jugador2: partida.jugadores[1],
          ganador,
          rondas: 2,
          tiempo: (Date.now() - partida.tiempoInicio) / 1000,
          tiempos_jugador1: partida.tiempos[partida.jugadores[0]],
          tiempos_jugador2: partida.tiempos[partida.jugadores[1]],
          rondas_completadas_jugador1: partida.rondasCompletadas[partida.jugadores[0]],
          rondas_completadas_jugador2: partida.rondasCompletadas[partida.jugadores[1]]
        });
      }
    }
  }, [letrasAdivinadas]);


  // Dentro del componente Game (intentos)
  useEffect(() => {
    if (errores >= 6) {
      const ganador = partida.jugadores[partida.ronda % 2 === 0 ? 1 : 0]; // Jugador contrario
      setMensajeFinal(`¡Game Over! Ganó ${ganador}`);
      
      axios.post('http://localhost:5000/api/history', {
        jugador1: partida.jugadores[0],
        jugador2: partida.jugadores[1],
        ganador,
        rondas: partida.ronda + 1,
        tiempo: (Date.now() - partida.tiempoInicio) / 1000,
        tiempos_jugador1: partida.tiempos[partida.jugadores[0]],
        tiempos_jugador2: partida.tiempos[partida.jugadores[1]],
        rondas_completadas_jugador1: partida.rondasCompletadas[partida.jugadores[0]],
        rondas_completadas_jugador2: partida.rondasCompletadas[partida.jugadores[1]]
      });

      setTimeout(() => {
        setPartida(null);
        setMensajeFinal('');
      }, 5000);
    }
  }, [errores]);

  const iniciarPartida = async () => {
    if (!jugadores.jugador1 || !jugadores.jugador2) {
      alert('¡Ingresa ambos nombres!');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/game/nueva-partida', jugadores);
      setPartida({
        ...response.data,
        tiempos: { 
          [response.data.jugadores[0]]: 0, 
          [response.data.jugadores[1]]: 0 
        },
        rondasCompletadas: { 
          [response.data.jugadores[0]]: 0, 
          [response.data.jugadores[1]]: 0 
        },
        tiempoInicio: Date.now()
      });
      setLetrasAdivinadas([]);
      setErrores(0);
    } catch (error) {
      console.error('Error al iniciar partida:', error);
      alert('Error al crear partida. Intenta nuevamente.');
    }
  };

  return (
    <div className="game-container">
      {!partida && (
        <div className="configuracion">
          <input
            placeholder="Jugador 1"
            value={jugadores.jugador1}
            onChange={(e) => setJugadores(prev => ({ ...prev, jugador1: e.target.value }))}
          />
          <input
            placeholder="Jugador 2"
            value={jugadores.jugador2}
            onChange={(e) => setJugadores(prev => ({ ...prev, jugador2: e.target.value }))}
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
            onKeyPress={adivinarLetra}
            disabledLetters={letrasAdivinadas}
          />
        </div>
      )}

      {mensajeFinal && (
        <div className="resultado-final">
          <h2>{mensajeFinal}</h2>
          <p className="contador-redireccion">Redirigiendo en {contador} segundos...</p>
          <div className="progress-bar">
            <div 
              className="progress" 
              style={{ width: `${(contador / 5) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Game;