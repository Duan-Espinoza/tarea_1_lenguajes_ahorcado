// components/HangmanDrawing.jsx
import React from 'react';

const HangmanDrawing = ({ errors }) => {
  const partesCuerpo = [
    // Cabeza
    <circle cx="140" cy="70" r="20" key="head" stroke="black" fill="none" strokeWidth="3"/>,
    
    // Cuerpo
    <line x1="140" y1="90" x2="140" y2="140" key="body" stroke="black" strokeWidth="3"/>,
    
    // Brazo izquierdo
    <line x1="140" y1="110" x2="100" y2="100" key="left-arm" stroke="black" strokeWidth="3"/>,
    
    // Brazo derecho
    <line x1="140" y1="110" x2="180" y2="100" key="right-arm" stroke="black" strokeWidth="3"/>,
    
    // Pierna izquierda
    <line x1="140" y1="140" x2="100" y2="180" key="left-leg" stroke="black" strokeWidth="3"/>,
    
    // Pierna derecha
    <line x1="140" y1="140" x2="180" y2="180" key="right-leg" stroke="black" strokeWidth="3"/>
  ];

  return (
    <svg width="300" height="250" viewBox="0 0 300 250">
      {/* Estructura de la horca */}
      <line x1="50" y1="230" x2="150" y2="230" stroke="black" strokeWidth="4"/>
      <line x1="100" y1="230" x2="100" y2="30" stroke="black" strokeWidth="4"/>
      <line x1="100" y1="30" x2="140" y2="30" stroke="black" strokeWidth="4"/>
      <line x1="140" y1="30" x2="140" y2="50" stroke="black" strokeWidth="4"/>
      
      {/* Partes del cuerpo */}
      {partesCuerpo.slice(0, errors)}
    </svg>
  );
};

export default HangmanDrawing;