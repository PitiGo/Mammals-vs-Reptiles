import React from 'react';

const RotateDeviceOverlay = ({ visible, onRequestLandscape, t }) => {
  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t('gameUI.rotateDeviceTitle')}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 5000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        padding: '28px',
        paddingTop: 'max(28px, env(safe-area-inset-top))',
        paddingBottom: 'max(28px, env(safe-area-inset-bottom))',
        color: 'white',
        textAlign: 'center',
        background: 'radial-gradient(circle at center, rgba(24, 52, 84, 0.98), rgba(3, 10, 22, 0.99))',
        touchAction: 'none',
      }}
    >
      <div
        aria-hidden="true"
        style={{
          fontSize: '72px',
          lineHeight: 1,
          transform: 'rotate(90deg)',
          filter: 'drop-shadow(0 0 16px rgba(96, 165, 250, 0.7))',
        }}
      >
        📱
      </div>
      <h2 style={{ margin: 0, fontSize: 'clamp(24px, 7vw, 34px)' }}>
        {t('gameUI.rotateDeviceTitle')}
      </h2>
      <p style={{ margin: 0, maxWidth: '420px', color: '#bfdbfe', lineHeight: 1.5 }}>
        {t('gameUI.rotateDeviceHint')}
      </p>
      <button
        type="button"
        onClick={onRequestLandscape}
        style={{
          marginTop: '6px',
          minHeight: '48px',
          padding: '11px 22px',
          borderRadius: '999px',
          border: '1px solid rgba(147, 197, 253, 0.8)',
          background: 'linear-gradient(135deg, #2563eb, #0891b2)',
          color: 'white',
          fontSize: '16px',
          fontWeight: 800,
          boxShadow: '0 8px 24px rgba(14, 116, 144, 0.35)',
        }}
      >
        {t('gameUI.enableLandscape')}
      </button>
    </div>
  );
};

export default RotateDeviceOverlay;
