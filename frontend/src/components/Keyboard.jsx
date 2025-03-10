// components/Keyboard.jsx
import React from 'react';

// En Keyboard.jsx
const Keyboard = ({ onKeyPress, disabledLetters }) => {
  const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  return (
    <div className="keyboard">
      {letras.map((letra) => (
        <button
          key={letra}
          onClick={() => onKeyPress(letra.toLowerCase())} // Enviar en minúscula
          disabled={disabledLetters.includes(letra.toLowerCase())} // Comparar en minúscula
        >
          {letra}
        </button>
      ))}
    </div>
  );
};

export default Keyboard;