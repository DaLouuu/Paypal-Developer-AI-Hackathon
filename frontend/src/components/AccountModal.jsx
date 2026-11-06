import React from 'react';
import SubGuardIcon from './SubGuardIcon';

export default function AccountModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(19, 35, 62, 0.5)',
        backdropFilter: 'blur(5px)',
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
          color: 'var(--navy, #13233e)',
          borderRadius: '20px',
          width: '100%',
          maxWidth: '500px',
          boxShadow: '0 24px 60px rgba(19, 35, 62, 0.22)',
          border: '1px solid var(--line, #dedbd3)',
          overflow: 'hidden',
          animation: 'toast-in 0.2s ease'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--line, #dedbd3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--surface-soft, #f1f3f5)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: 'var(--navy, #13233e)',
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
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, fontFamily: 'Manrope, sans-serif' }}>
                Alex Morgan
              </h3>
              <small style={{ color: 'var(--muted)', fontSize: '11px' }}>
                Founder Admin · PayPal Dev Sandbox
              </small>
            </div>
          </div>
          <button
            onClick={onClose}
            className="icon-button"
            style={{ fontSize: '20px', color: 'var(--muted)' }}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, color: 'var(--muted)' }}>
              Active Autonomous Spending Policy
            </span>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '10px',
                marginTop: '8px'
              }}
            >
              <div style={{ padding: '12px', background: 'var(--surface-soft)', borderRadius: '10px', border: '1px solid var(--line)' }}>
                <small style={{ fontSize: '9px', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 700 }}>Single Transaction Ceiling</small>
                <div style={{ fontSize: '16px', fontWeight: 800, marginTop: '2px' }}>$50.00</div>
                <small style={{ fontSize: '10px', color: 'var(--muted)' }}>Transactions above require HITL approval</small>
              </div>
              <div style={{ padding: '12px', background: 'var(--surface-soft)', borderRadius: '10px', border: '1px solid var(--line)' }}>
                <small style={{ fontSize: '9px', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 700 }}>Monthly Budget Hard Cap</small>
                <div style={{ fontSize: '16px', fontWeight: 800, marginTop: '2px' }}>$500.00</div>
                <small style={{ fontSize: '10px', color: 'var(--muted)' }}>Hard deterministic rejection ceiling</small>
              </div>
            </div>
          </div>

          <div>
            <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, color: 'var(--muted)' }}>
              Cryptographic Key & Protocol Binding
            </span>
            <div style={{ padding: '12px', background: 'var(--surface-soft)', borderRadius: '10px', border: '1px solid var(--line)', marginTop: '8px', fontSize: '11px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ color: 'var(--muted)' }}>AP2 Protocol Verifier:</span>
                <strong style={{ color: '#1aa978' }}>Ed25519 ENFORCED</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ color: 'var(--muted)' }}>Key Fingerprint:</span>
                <code style={{ fontSize: '10px', background: 'rgba(0,0,0,0.06)', padding: '1px 4px', borderRadius: '4px' }}>
                  ed25519:e4a7...99b2
                </code>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--muted)' }}>FastMCP Proxy Gateway:</span>
                <span>http://localhost:8000</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid var(--line, #dedbd3)',
            display: 'flex',
            justifyContent: 'flex-end',
            background: 'var(--surface-soft, #f1f3f5)'
          }}
        >
          <button
            type="button"
            className="primary-button"
            onClick={onClose}
            style={{ padding: '8px 16px', fontSize: '12px' }}
          >
            Close Settings
          </button>
        </div>
      </div>
    </div>
  );
}

