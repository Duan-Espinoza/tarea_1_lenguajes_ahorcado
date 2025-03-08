// components/History.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function History() {
  const [partidas, setPartidas] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/history')
      .then(response => setPartidas(response.data))
      .catch(error => console.error(error));
  }, []);

  return (
    <div>
      <h2>Historial de Partidas</h2>
      <table>
        <thead>
          <tr>
            <th>Jugador 1</th>
            <th>Jugador 2</th>
            <th>Ganador</th>
            <th>Rondas</th>
            <th>Tiempo (s)</th>
          </tr>
        </thead>
        <tbody>
          {partidas.map((partida) => (
            <tr key={partida.id}>
              <td>{partida.jugador1}</td>
              <td>{partida.jugador2}</td>
              <td>{partida.ganador || 'Empate'}</td>
              <td>{partida.rondas}</td>
              <td>{partida.tiempo}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default History;