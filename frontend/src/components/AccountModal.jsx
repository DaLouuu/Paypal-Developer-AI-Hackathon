import React, { useState } from 'react';
import SubGuardIcon from './SubGuardIcon';

export default function AccountModal({ isOpen, onClose, spendingCap = 50, onUpdateSpendingCap }) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempCap, setTempCap] = useState(spendingCap);

  if (!isOpen) return null;

  const handleSave = () => {
    if (onUpdateSpendingCap) {
      onUpdateSpendingCap(Number(tempCap));
    }
    setIsEditing(false);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(10, 17, 40, 0.55)',
        backdropFilter: 'blur(6px)',
        zIndex: 1000,
        display: 'grid',
        placeItems: 'center',
        padding: '16px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'var(--surface, #ffffff)',
          color: 'var(--navy, #0a1128)',
          borderRadius: '20px',
          width: '100%',
          maxWidth: '520px',
          boxShadow: '0 24px 60px rgba(10, 17, 40, 0.22)',
          border: '1px solid var(--line, #001f54)',
          overflow: 'hidden',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          animation: 'toast-in 0.2s ease'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--line, #001f54)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--surface-soft, #ffffff)',
            flexShrink: 0
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'var(--navy, #0a1128)',
                color: 'white',
                display: 'grid',
                placeItems: 'center',
                fontWeight: 700,
                fontSize: '13px'
              }}
            >
              AM
            </span>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, fontFamily: 'Manrope, sans-serif' }}>
                  Alex Morgan
                </h3>
                <span className="badge-verified">
                  VERIFIED PRINCIPAL
                </span>
              </div>
              <small style={{ color: 'var(--muted)', fontSize: '11px' }}>
                Founder Admin · PayPal Dev Sandbox Organization
              </small>
            </div>
          </div>
          <button
            onClick={onClose}
            className="icon-button modal-close"
            aria-label="Close modal"
            style={{ fontSize: '20px', color: 'var(--muted)' }}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px', overflowY: 'auto' }}>
          {/* Section 1: Active Autonomous Spending Guardrails */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, color: 'var(--muted)' }}>
                Autonomous Spending Guardrails
              </span>
              <button
                type="button"
                className="text-button"
                onClick={() => setIsEditing(!isEditing)}
                style={{ fontSize: '11px', color: 'var(--blue)' }}
              >
                {isEditing ? 'Cancel Edit' : 'Adjust Ceilings'}
              </button>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px'
              }}
            >
              {/* Single Transaction Ceiling Card */}
              <div style={{ padding: '14px', background: 'var(--surface-soft)', borderRadius: '12px', border: '1px solid var(--line)' }}>
                <small style={{ fontSize: '9px', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Single Transaction Ceiling
                </small>
                {isEditing ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
                    <span style={{ fontWeight: 700, fontSize: '16px' }}>$</span>
                    <input
                      type="number"
                      min="10"
                      max="200"
                      value={tempCap}
                      onChange={(e) => setTempCap(Number(e.target.value))}
                      style={{
                        width: '60px',
                        padding: '3px 6px',
                        borderRadius: '6px',
                        border: '1.5px solid var(--blue)',
                        background: 'var(--surface)',
                        color: 'var(--navy)',
                        fontWeight: 700,
                        fontSize: '14px'
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleSave}
                      style={{
                        border: 0,
                        background: 'var(--blue)',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <div style={{ fontSize: '18px', fontWeight: 800, fontFamily: 'Manrope', marginTop: '2px' }}>
                    ${spendingCap.toFixed(2)}
                  </div>
                )}
                <small style={{ fontSize: '10px', color: 'var(--muted)', display: 'block', marginTop: '3px' }}>
                  Transactions above trigger human sign-off
                </small>
              </div>

              {/* Monthly Budget Hard Cap Card */}
              <div style={{ padding: '14px', background: 'var(--surface-soft)', borderRadius: '12px', border: '1px solid var(--line)' }}>
                <small style={{ fontSize: '9px', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Monthly Budget Hard Cap
                </small>
                <div style={{ fontSize: '18px', fontWeight: 800, fontFamily: 'Manrope', marginTop: '2px' }}>
                  $500.00
                </div>
                <small style={{ fontSize: '10px', color: 'var(--muted)', display: 'block', marginTop: '3px' }}>
                  Hard deterministic rejection ceiling
                </small>
              </div>
            </div>
          </div>

          {/* Section 2: Cryptographic Identity & Protocol Binding */}
          <div>
            <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, color: 'var(--muted)' }}>
              Cryptographic Verification & Gateway
            </span>
            <div style={{ padding: '14px', background: 'var(--surface-soft)', borderRadius: '12px', border: '1px solid var(--line)', marginTop: '8px', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--muted)' }}>AP2 Protocol Verifier:</span>
                <span style={{ color: '#5dfdcb', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <SubGuardIcon name="check" size={13} /> Ed25519 Enforced
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--muted)' }}>Key Fingerprint:</span>
                <code className="fingerprint-pill">
                  ed25519:e4a7...99b2
                </code>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--muted)' }}>FastMCP Proxy Gateway:</span>
                <span style={{ fontWeight: 600, color: 'var(--navy)' }}>ONLINE (Port 8000)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid var(--line, #001f54)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--surface-soft, #ffffff)'
          }}
        >
          <small style={{ fontSize: '11px', color: 'var(--muted)' }}>
            Governed by PayPal Developer Platform AP2 Mandates
          </small>
          <button
            type="button"
            className="primary-button"
            onClick={onClose}
            style={{ padding: '8px 18px', fontSize: '12px' }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
