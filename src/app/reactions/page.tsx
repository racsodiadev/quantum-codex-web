"use client";

import { useState } from 'react';
import { CardViewer } from '@/components/reactions/CardViewer';

export default function Reactions() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(1);
  const [inputValue, setInputValue] = useState('1');

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSearch = () => {
    const num = parseInt(inputValue, 10);
    if (!isNaN(num) && num >= 0 && num <= 999) {
      setSelectedCard(num);
    } else {
      alert('Por favor ingresa un número entre 0 (Triple Void) y 999');
      setInputValue(String(selectedCard));
    }
  };

  const handlePrevious = () => {
    if (selectedCard > 0) {
      const newNumber = selectedCard - 1;
      setSelectedCard(newNumber);
      setInputValue(String(newNumber));
    }
  };

  const handleNext = () => {
    if (selectedCard < 999) {
      const newNumber = selectedCard + 1;
      setSelectedCard(newNumber);
      setInputValue(String(newNumber));
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 gap-8 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Aurora Reactions</h1>
        <p className="text-gray-600">Visualiza cualquiera de las 1000 cartas (Triple Void + 999 reacciones)</p>
      </div>

      <button
        onClick={openModal}
        className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-lg transition transform hover:scale-105"
      >
        Abrir Visor de Cartas
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6">
            {/* Header del Modal */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Reacciones de Aurora</h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ✕
              </button>
            </div>

            {/* CardViewer */}
            <div className="flex justify-center mb-6">
              <CardViewer reactionNumber={selectedCard} showNumber={true} />
            </div>

            {/* Controles de búsqueda */}
            <div className="flex gap-2 mb-4">
              <input
                type="number"
                min="0"
                max="999"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1 px-3 py-2 rounded border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500"
                placeholder="Ingresa número (0-999)"
              />
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold transition"
              >
                Ir
              </button>
            </div>


            {/* Botón de cierre */}
            <button
              onClick={closeModal}
              className="w-full mt-4 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded font-semibold transition"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

