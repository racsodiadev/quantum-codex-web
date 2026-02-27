import { useState } from 'react';
  const discos = [
    { src: '/images/disco_1.png', alt: 'Disco 1', left: '1.5%', top: '6%', zIndex: -1 },
    { src: '/images/disco_2.png', alt: 'Disco 2', left: '28.7%', top: '17%', zIndex: -2 },
    { src: '/images/disco_3.png', alt: 'Disco 3', left: '56%', top: '6%', zIndex: -1 },
  ];

  const botones = [
    { left: '15%', top: '5%', label: 'Boton 1' },
    { left: '43%', top: '16%', label: 'Boton 2' },
    { left: '71.2%', top: '5%', label: 'Boton 3' },
  ];


export default function QuantumCodex() {
      const [angles, setAngles] = useState<number[]>([0, 0, 0]);
    return (
       <div
        className="w-full max-w-2xl bg-contain bg-center bg-no-repeat h-96 relative"
        style={{
          backgroundImage: 'url(/images/quantum_codex.png)',
          aspectRatio: '1',
        }}
      >
        {botones.map((boton, index) => (
          <button
            key={index}
            aria-label={boton.label}
            className="absolute cursor-pointer rounded-b-full"
            style={{
              left: boton.left,
              top: boton.top,
              padding: '16px',
              background: 'transparent',
              color: 'transparent',
              border: 'none',
              opacity: 0,
              width: '100px',
              height: '50px',
            }}
            onClick={() =>
              setAngles(prev => prev.map((a, i) => (i === index ? (a + 36) % 360 : a)))
            }
          />
        ))}
        {discos.map((disco, index) => (
          <img
            key={index}
            src={disco.src}
            alt={disco.alt}
            style={{
              position: 'absolute',
              width: '42.5%',
              left: disco.left,
              top: disco.top,
              zIndex: disco.zIndex,
              aspectRatio: '1',
              objectFit: 'contain',
              transformOrigin: '50% 50%',
              transform: `rotate(${angles[index]}deg)`,
              transition: 'transform 200ms ease',
            }}
          />
        ))}
      </div>
    );
}
