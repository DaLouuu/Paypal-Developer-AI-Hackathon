import React from 'react';
import { AlertCircle, X } from 'lucide-react';

export default function ConfirmationModal({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  confirmStyle = 'danger',
  onConfirm,
  onCancel
}) {
  if (!isOpen) return null;

  const isDanger = confirmStyle === 'danger';

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--surface, #ffffff)',
          color: 'var(--navy, #060723)',
          borderRadius: '18px',
          width: '100%',
          maxWidth: '460px',
          boxShadow: '0 24px 60px rgba(6, 7, 35, 0.22)',
          border: '1px solid var(--line, #1b1f9d)',
          padding: '26px',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
          animation: 'toast-in 0.2s ease'
        }}
      >
        <button
          onClick={onCancel}
          className="icon-button modal-close"
          aria-label="Close modal"
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            fontSize: '18px',
            color: 'var(--muted)'
          }}
        >
          <X size={18} />
        </button>

        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
          <div
            className={`confirm-icon-box ${isDanger ? 'danger' : 'primary'}`}
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <AlertCircle size={22} />
          </div>

          <div style={{ flex: 1 }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, fontFamily: 'Manrope, sans-serif', color: 'var(--navy)' }}>
              {title}
            </h3>
            <p style={{ margin: '10px 0 0 0', fontSize: '13px', color: 'var(--muted)', lineHeight: 1.55 }}>
              {message}
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
              <button
                type="button"
                className="cancel-btn text-button"
                onClick={onCancel}
                style={{
                  border: '1px solid var(--line)',
                  backgroundColor: 'var(--surface-soft)',
                  color: 'var(--navy)',
                  borderRadius: '9px',
                  padding: '9px 16px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                className="confirm-btn primary-button"
                onClick={onConfirm}
                style={{
                  border: 'none',
                  backgroundColor: isDanger ? '#f9dec9' : 'var(--blue, #216e65)',
                  color: '#ffffff',
                  borderRadius: '9px',
                  padding: '9px 18px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: isDanger ? '0 4px 14px rgba(249, 222, 201, 0.25)' : '0 4px 14px rgba(33, 110, 101, 0.25)'
                }}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
