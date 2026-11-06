import React from 'react';
import SubGuardIcon from './SubGuardIcon';

export default function NotificationsDrawer({ isOpen, onClose, onNavigate, onApproveDatadog }) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(19, 35, 62, 0.45)',
        backdropFilter: 'blur(4px)',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'flex-end'
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          height: '100%',
          backgroundColor: 'var(--surface, #ffffff)',
          color: 'var(--navy, #13233e)',
          boxShadow: '-8px 0 32px rgba(19, 35, 62, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          borderLeft: '1px solid var(--line, #dedbd3)',
          animation: 'toast-in 0.25s ease'
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <SubGuardIcon name="bell" size={18} />
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, fontFamily: 'Manrope, sans-serif' }}>
              Notifications & Alerts
            </h3>
          </div>
          <button
            onClick={onClose}
            className="icon-button"
            style={{ fontSize: '20px', color: 'var(--muted)' }}
          >
            ×
          </button>
        </div>

        {/* Notifications List */}
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', flex: 1, overflowY: 'auto' }}>
          {/* Notification 1: Cursor Trial */}
          <div
            style={{
              padding: '14px',
              borderRadius: '12px',
              backgroundColor: '#fffbf2',
              border: '1px solid #e5d9be',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '10px', fontWeight: 700, color: '#a07832', textTransform: 'uppercase' }}>
                48h Cancellation Shield Armed
              </span>
              <span style={{ fontSize: '10px', color: '#a07832' }}>Today</span>
            </div>
            <strong style={{ fontSize: '13px', color: '#13233e' }}>Cursor Pro Trial Ending Soon</strong>
            <p style={{ margin: 0, fontSize: '11px', color: '#687387', lineHeight: 1.4 }}>
              Trial ends in 2 days (Nov 10). SubGuard will automatically prevent unwanted $80.00/mo rollover charges unless you confirm renewal.
            </p>
            <div style={{ marginTop: '4px' }}>
              <button
                type="button"
                className="text-button"
                style={{ fontSize: '11px', color: '#3f64ff' }}
                onClick={() => {
                  onClose();
                  onNavigate('protection');
                }}
              >
                Inspect Protection Timeline <SubGuardIcon name="arrow" size={12} />
              </button>
            </div>
          </div>

          {/* Notification 2: Datadog Mandate Suspension */}
          <div
            style={{
              padding: '14px',
              borderRadius: '12px',
              backgroundColor: '#fff0ef',
              border: '1px solid #ffd4d1',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '10px', fontWeight: 700, color: '#c24e49', textTransform: 'uppercase' }}>
                Human Approval Required
              </span>
              <span style={{ fontSize: '10px', color: '#c24e49' }}>1h ago</span>
            </div>
            <strong style={{ fontSize: '13px', color: '#13233e' }}>Datadog APM Spending Limit Exceeded</strong>
            <p style={{ margin: 0, fontSize: '11px', color: '#687387', lineHeight: 1.4 }}>
              Agent requested $75.00/mo, exceeding your $50.00 autonomous ceiling. The transaction has been safely suspended awaiting your Ed25519 signature.
            </p>
            <div style={{ marginTop: '6px' }}>
              <button
                type="button"
                className="approve-button"
                style={{ padding: '6px 12px', fontSize: '11px' }}
                onClick={() => {
                  onClose();
                  if (onApproveDatadog) onApproveDatadog();
                }}
              >
                Review & Approve Mandate
              </button>
            </div>
          </div>

          {/* Notification 3: FastMCP Live Gateway */}
          <div
            style={{
              padding: '14px',
              borderRadius: '12px',
              backgroundColor: 'var(--surface-soft, #f1f3f5)',
              border: '1px solid var(--line, #dedbd3)',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '10px', fontWeight: 700, color: '#1aa978', textTransform: 'uppercase' }}>
                System Operational
              </span>
              <span style={{ fontSize: '10px', color: 'var(--muted)' }}>Active</span>
            </div>
            <strong style={{ fontSize: '13px' }}>FastMCP Protocol Proxy Online</strong>
            <p style={{ margin: 0, fontSize: '11px', color: 'var(--muted)', lineHeight: 1.4 }}>
              SubGuard proxy running on port 8000 with AP2 cryptographic governance active.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--line, #dedbd3)', textAlign: 'center' }}>
          <small style={{ fontSize: '10px', color: 'var(--muted)' }}>
            All notifications are logged in the cryptographic audit trail.
          </small>
        </div>
      </div>
    </div>
  );
}
