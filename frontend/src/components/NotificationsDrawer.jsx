import React from 'react';
import SubGuardIcon from './SubGuardIcon';

export default function NotificationsDrawer({ isOpen, onClose, onNavigate, onApproveDatadog }) {
  if (!isOpen) return null;

  return (
    <div
      className="drawer-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(6, 7, 35, 0.45)',
        backdropFilter: 'blur(4px)',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'flex-end'
      }}
      onClick={onClose}
    >
      <div
        className="drawer-panel"
        style={{
          width: '100%',
          maxWidth: '430px',
          height: '100%',
          backgroundColor: 'var(--surface, #ffffff)',
          color: 'var(--navy, #060723)',
          boxShadow: '-10px 0 36px rgba(6, 7, 35, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          borderLeft: '1px solid var(--line, #a6bbe2)',
          animation: 'toast-in 0.25s ease'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '22px 24px',
            borderBottom: '1px solid var(--line, #a6bbe2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--surface-soft, #ffffff)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                display: 'grid',
                placeItems: 'center',
                background: 'rgba(33, 110, 101, 0.1)',
                color: 'var(--blue)'
              }}
            >
              <SubGuardIcon name="bell" size={17} />
            </span>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, fontFamily: 'var(--font-sans)' }}>
                Notifications & Alerts
              </h3>
              <small style={{ fontSize: '10px', color: 'var(--muted)', fontWeight: 600 }}>
                2 pending actions require attention
              </small>
            </div>
          </div>
          <button
            onClick={onClose}
            className="icon-button modal-close"
            aria-label="Close notifications"
            title="Close notifications panel (Esc)"
            style={{ fontSize: '20px', color: 'var(--muted)' }}
          >
            ×
          </button>
        </div>

        {/* Notifications List */}
        <div style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, minHeight: 0, overflowY: 'auto' }}>
          {/* Notification 1: Cursor Trial */}
          <div className="notice-card notice-card-amber">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="notice-tag tag-amber">
                48h Cancellation Shield Armed
              </span>
              <span className="notice-time">Today</span>
            </div>
            <strong className="notice-title">Cursor Pro Trial Ending Soon</strong>
            <p className="notice-body">
              Trial ends in 2 days (Nov 10). SubGuard will automatically prevent unwanted $80.00/mo rollover charges unless you confirm renewal.
            </p>
            <div style={{ marginTop: '6px' }}>
              <button
                type="button"
                className="text-button"
                style={{ fontSize: '12px', color: 'var(--blue)' }}
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
          <div className="notice-card notice-card-crimson">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="notice-tag tag-crimson">
                Human Approval Required
              </span>
              <span className="notice-time">1h ago</span>
            </div>
            <strong className="notice-title">Datadog APM Spending Limit Exceeded</strong>
            <p className="notice-body">
              Agent requested $75.00/mo, exceeding your $50.00 autonomous ceiling. The transaction has been safely suspended awaiting your Ed25519 signature.
            </p>
            <div style={{ marginTop: '8px' }}>
              <button
                type="button"
                className="approve-button"
                style={{ padding: '8px 14px', fontSize: '11px', fontWeight: 700 }}
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
          <div className="notice-card notice-card-neutral">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="notice-tag tag-green">
                System Operational
              </span>
              <span className="notice-time">Active</span>
            </div>
            <strong className="notice-title">FastMCP Protocol Proxy Online</strong>
            <p className="notice-body">
              SubGuard proxy running on port 8000 with AP2 cryptographic governance active.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
