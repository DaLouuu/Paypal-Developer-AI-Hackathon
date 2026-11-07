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
          boxShadow: '0 24px 60px rgba(6, 7, 35, 0.22), 4px 4px 0px var(--line, #a6bbe2)',
          border: '1.5px solid var(--line, #a6bbe2)',
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
          title="Close dialog (Esc)"
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
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, fontFamily: 'var(--font-sans)' }}>
              {title}
            </h3>
            <p style={{ margin: '10px 0 0 0', fontSize: '13px', lineHeight: 1.55 }}>
              {message}
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
              <button
                type="button"
                className="cancel-btn text-button"
                title="Dismiss without making changes"
                onClick={onCancel}
              >
                Cancel
              </button>

              <button
                type="button"
                className={`confirm-btn ${isDanger ? 'danger' : 'primary'}`}
                title={confirmText}
                onClick={onConfirm}
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
