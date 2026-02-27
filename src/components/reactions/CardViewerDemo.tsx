import React, { useState } from 'react';
import { CardViewer } from './CardViewer';

export function CardViewerDemo() {
  const [reactionNumber, setReactionNumber] = useState<number>(1);
  const [inputValue, setInputValue] = useState<string>('1');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSearch = () => {
    const num = parseInt(inputValue, 10);
    if (!isNaN(num) && num >= 1 && num <= 999) {
      setReactionNumber(num);
    } else {
      alert('Por favor ingresa un número entre 1 y 999');
      setInputValue(String(reactionNumber));
    }
  };

  const handlePrevious = () => {
    if (reactionNumber > 1) {
      setReactionNumber(reactionNumber - 1);
      setInputValue(String(reactionNumber - 1));
    }
  };

  const handleNext = () => {
    if (reactionNumber < 999) {
      setReactionNumber(reactionNumber + 1);
      setInputValue(String(reactionNumber + 1));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-8 bg-gradient-to-b from-gray-900 to-gray-800 min-h-screen">
      <h1 className="text-3xl font-bold text-white mb-4">Aurora Card Viewer</h1>

      <CardViewer reactionNumber={reactionNumber} showNumber={true} />

      <div className="flex flex-col gap-4 w-full max-w-md">
        <div className="flex gap-2">
          <input
            type="number"
            min="1"
            max="999"
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1 px-4 py-2 rounded border border-gray-400 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            placeholder="Ingresa número (1-999)"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold transition"
          >
            Buscar
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handlePrevious}
            disabled={reactionNumber === 1}
            className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-500 disabled:bg-gray-400 text-white rounded font-semibold transition"
          >
            ← Anterior
          </button>
          <span className="flex items-center justify-center Text-white font-semibold px-4 bg-gray-700 rounded min-w-[80px]">
            {reactionNumber}/999
          </span>
          <button
            onClick={handleNext}
            disabled={reactionNumber === 999}
            className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-500 disabled:bg-gray-400 text-white rounded font-semibold transition"
          >
            Siguiente →
          </button>
        </div>
      </div>

      <div className="text-gray-400 text-sm mt-4">
        <p>Total de cartas: 999</p>
        <p>Actual: {`Reaction-${String(reactionNumber).padStart(3, '0')}`}</p>
      </div>
    </div>
  );
}

export default CardViewerDemo;
