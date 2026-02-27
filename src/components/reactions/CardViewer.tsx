import React, { useMemo, useEffect, useRef, useState } from 'react';
import auroraCardsData from '@/assets/aurora_cards.json';
import tripleVoidData from '@/assets/triple_void.json';

interface CardPosition {
  deckId: string;
  pixelX: number;
  pixelY: number;
  width: number;
  height: number;
}

/**
 * Calcula la posición de una carta en el spritesheet
 * @param reactionNumber - Número de la carta (1-999)
 * @returns Objeto con información de posición para visualizar la carta
 */
function getCardPosition(reactionNumber: number): CardPosition {
  if (reactionNumber < 1 || reactionNumber > 999) {
    throw new Error('Reaction number must be between 1 and 999');
  }

  const CARDS_PER_DECK = 70;
  const CARD_WIDTH = 332;
  const CARD_HEIGHT = 506;
  const COLUMNS = 10;

  // Calcular cuál deck contiene la carta (1-15)
  const deckId = Math.floor((reactionNumber - 1) / CARDS_PER_DECK) + 1;

  // Posición dentro del deck (0-69)
  const positionInDeck = (reactionNumber - 1) % CARDS_PER_DECK;

  // Fila y columna en la grilla
  const row = Math.floor(positionInDeck / COLUMNS);
  const col = positionInDeck % COLUMNS;

  // Píxeles de inicio
  const pixelX = col * CARD_WIDTH;
  const pixelY = row * CARD_HEIGHT;

  return {
    deckId: String(deckId),
    pixelX,
    pixelY,
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
  };
}

/**
 * Limpia la URL removiendo el prefijo {verifycache}
 */
function cleanUrl(url: string): string {
  return url.replace('{verifycache}', '');
}

/**
 * Obtiene la URL del FaceUrl para un número de reacción
 */
function getFaceUrlForReaction(reactionNumber: number): string {
  try {
    // Caso especial: Triple Void (número 0)
    if (reactionNumber === 0) {
      const tripleVoidDeck = (tripleVoidData as any).ObjectStates[0].CustomDeck['1'];
      if (!tripleVoidDeck) {
        throw new Error('Triple Void deck not found');
      }
      return cleanUrl(tripleVoidDeck.FaceUrl);
    }

    // Aurora Reactions (1-999)
    const position = getCardPosition(reactionNumber);
    const customDeck = (auroraCardsData as any).ObjectStates[0].CustomDeck[position.deckId];
    
    if (!customDeck) {
      throw new Error(`CustomDeck ${position.deckId} not found`);
    }

    return cleanUrl(customDeck.FaceUrl);
  } catch (error) {
    console.error('Error getting FaceUrl:', error);
    throw error;
  }
}

interface CardViewerProps {
  reactionNumber: number;
  className?: string;
  showNumber?: boolean;
}

/**
 * Componente que visualiza una carta individual
 * @param reactionNumber - Número de reacción (1-999)
 * @param className - Clases CSS adicionales
 * @param showNumber - Mostrar el número de reacción
 */
export function CardViewer({ 
  reactionNumber, 
  className = '', 
  showNumber = true 
}: CardViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cardData = useMemo(() => {
    try {
      // Caso especial: Triple Void (número 0)
      if (reactionNumber === 0) {
        return {
          deckId: '1',
          pixelX: 0,
          pixelY: 0,
          width: 332,
          height: 506,
        };
      }

      return getCardPosition(reactionNumber);
    } catch (error) {
      console.error(error);
      return null;
    }
  }, [reactionNumber]);

  const faceUrl = useMemo(() => {
    try {
      return getFaceUrlForReaction(reactionNumber);
    } catch (error) {
      console.error(error);
      return '';
    }
  }, [reactionNumber]);

  useEffect(() => {
    if (!canvasRef.current || !cardData || !faceUrl) {
      setError('No se pudo cargar la carte');
      setIsLoading(false);
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      setError('No se pudo obtener contexto del canvas');
      setIsLoading(false);
      return;
    }

    // Crear una imagen
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        // Dibujar solo la sección de la carta
        ctx.drawImage(
          img,
          cardData.pixelX,
          cardData.pixelY,
          cardData.width,
          cardData.height,
          0,
          0,
          cardData.width,
          cardData.height
        );
        setIsLoading(false);
        setError(null);
      } catch (err) {
        console.error('Error al dibujar imagen:', err);
        setError('Error al procesar la imagen');
        setIsLoading(false);
      }
    };

    img.onerror = () => {
      console.error('Error cargando imagen:', faceUrl);
      setError('Error cargando imagen desde servidor');
      setIsLoading(false);
    };

    setIsLoading(true);
    img.src = faceUrl;
  }, [reactionNumber, cardData, faceUrl]);

  const reactionLabel = reactionNumber === 0 
    ? 'Triple Void' 
    : `Reaction-${String(reactionNumber).padStart(3, '0')}`;

  if (error) {
    return (
      <div className={`bg-red-100 border border-red-300 rounded flex items-center justify-center ${className}`} style={{ width: '332px', height: '506px' }}>
        <p className="text-red-600 text-center px-4">{error}</p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <div className="relative bg-gray-100 rounded shadow-lg overflow-hidden" style={{ width: '332px', height: '506px' }}>
        <canvas
          ref={canvasRef}
          width={332}
          height={506}
          className="w-full h-full"
        />
        {isLoading && (
          <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
            <p className="text-gray-500">Cargando...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CardViewer;
