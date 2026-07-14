import React, { useEffect, useRef } from 'react';

const GameToast = ({ message, type = 'error', onDismiss, duration = 4000 }) => {
  const onDismissRef = useRef(onDismiss);

  useEffect(() => {
    onDismissRef.current = onDismiss;
  }, [onDismiss]);

  useEffect(() => {
    if (!message) return undefined;
    const timer = setTimeout(() => onDismissRef.current?.(), duration);
    return () => clearTimeout(timer);
  }, [message, duration]);

  if (!message) return null;

  const bg = type === 'error' ? 'rgba(220, 38, 38, 0.95)' : 'rgba(30, 64, 175, 0.95)';

  return (
    <div
      role="alert"
      style={{
        position: 'fixed',
        // Aviso lateral: evita el centro de acción, el marcador y el reloj.
        top: 'max(12px, env(safe-area-inset-top))',
        left: 'max(12px, env(safe-area-inset-left))',
        zIndex: 10000,
        backgroundColor: bg,
        color: 'white',
        padding: '0.6rem 1.1rem',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        maxWidth: 'min(320px, 44vw)',
        fontSize: '0.9rem',
        textAlign: 'center',
        pointerEvents: 'none',
        animation: 'fadeIn 0.2s ease',
      }}
    >
      {message}
    </div>
  );
};

export default GameToast;
