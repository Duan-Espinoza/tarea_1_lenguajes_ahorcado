// components/Keyboard.jsx
import React from 'react';

const Keyboard = ({ onKeyPress, disabledLetters }) => {
  const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  return (
    <div className="keyboard">
      {letras.map((letra) => (
        <button 
          key={letra}
          onClick={() => onKeyPress(letra)}
          disabled={disabledLetters.includes(letra)}
        >
          {letra}
        </button>
      ))}
    </div>
  );
};

export default Keyboard;