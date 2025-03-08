// components/HangmanDrawing.jsx
import React from 'react';

const HangmanDrawing = ({ errors }) => {
  const partesCuerpo = [
    <circle cx="140" cy="70" r="20" key="head"/>, // Cabeza
    <line x1="140" y1="90" x2="140" y2="150" key="body"/>, // Cuerpo
    <line x1="140" y1="110" x2="100" y2="100" key="left-arm"/>, // Brazo izquierdo
    <line x1="140" y1="110" x2="180" y2="100" key="right-arm"/>, // Brazo derecho
    <line x1="140" y1="150" x2="100" y2="180" key="left-leg"/>, // Pierna izquierda
    <line x1="140" y1="150" x2="180" y2="180" key="right-leg"/>, // Pierna derecha
  ];

  return (
    <svg width="300" height="250">
      {/* Base y horca */}
      <line x1="20" y1="230" x2="120" y2="230" stroke="black" />
      <line x1="70" y1="230" x2="70" y2="30" stroke="black" />
      <line x1="70" y1="30" x2="140" y2="30" stroke="black" />
      <line x1="140" y1="30" x2="140" y2="50" stroke="black" />
      
      {partesCuerpo.slice(0, errors)}
    </svg>
  );
};

export default HangmanDrawing;