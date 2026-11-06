import React from 'react';
import { AlertCircle, X } from 'lucide-react';

export default function ConfirmationModal({ isOpen, title, message, confirmText = 'Confirm', confirmStyle = 'danger', onConfirm, onCancel }) {
  if (!isOpen) return null;

  const isDanger = confirmStyle === 'danger';

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          width: '100%',
          maxWidth: '440px',
          boxShadow: '0 20px 25px -5px rgba(15, 23, 42, 0.15), 0 8px 10px -6px rgba(15, 23, 42, 0.1)',
          border: '1px solid #e2e8f0',
          padding: '24px',
          position: 'relative',
        }}
      >
        <button
          onClick={onCancel}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            border: 'none',
            background: 'transparent',
            color: '#94a3b8',
            cursor: 'pointer',
            padding: '4px'
          }}
        >
          <X size={16} />
        </button>

        <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              backgroundColor: isDanger ? '#fee2e2' : '#dbeafe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isDanger ? '#dc2626' : '#2563eb',
              flexShrink: 0
            }}
          >
            <AlertCircle size={20} />
          </div>

          <div style={{ flex: 1 }}>
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#0f172a' }}>{title}</h3>
            <p style={{ margin: '8px 0 0 0', fontSize: '13px', color: '#64748b', lineHeight: 1.5 }}>{message}</p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button
                type="button"
                onClick={onCancel}
                style={{
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  color: '#475569',
                  borderRadius: '6px',
                  padding: '7px 14px',
                  fontSize: '12px',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={onConfirm}
                style={{
                  border: 'none',
                  backgroundColor: isDanger ? '#dc2626' : '#2563eb',
                  color: '#ffffff',
                  borderRadius: '6px',
                  padding: '7px 16px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: isDanger ? '0 1px 2px rgba(220, 38, 38, 0.2)' : '0 1px 2px rgba(37, 99, 235, 0.2)'
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

