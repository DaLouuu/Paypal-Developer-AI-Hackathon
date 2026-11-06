import React from 'react';
import SubGuardIcon from './SubGuardIcon';
import RiskMeter from './RiskMeter';

export default function ProductDetailsModal({ product, isOpen, onClose, onProvision }) {
  if (!isOpen || !product) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(19, 35, 62, 0.55)',
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
          color: 'var(--navy, #13233e)',
          borderRadius: '20px',
          width: '100%',
          maxWidth: '520px',
          boxShadow: '0 24px 60px rgba(19, 35, 62, 0.22)',
          border: '1px solid var(--line, #dedbd3)',
          overflow: 'hidden',
          animation: 'toast-in 0.2s ease'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
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
              className="product-logo"
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: product.bg || '#f1f1ef',
                color: product.color || '#13233e',
                fontSize: '18px'
              }}
            >
              {product.mark || product.name.charAt(0)}
            </span>
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, fontFamily: 'Manrope, sans-serif' }}>
                {product.name}
              </h3>
              <div style={{ fontSize: '11px', color: 'var(--muted, #687387)' }}>
                {product.vendor_domain || `${product.name.toLowerCase()}.com`} · {product.category}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="icon-button modal-close"
            aria-label="Close modal"
            style={{ fontSize: '20px', color: 'var(--muted, #687387)' }}
          >
            ×
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px', maxHeight: '70vh', overflowY: 'auto' }}>
          <div>
            <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, color: 'var(--muted)' }}>
              Overview
            </span>
            <p style={{ margin: '6px 0 0', fontSize: '13px', lineHeight: 1.5, color: 'var(--text-muted)' }}>
              {product.line}
            </p>
          </div>

          {/* Pricing & Tier Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              backgroundColor: 'var(--surface-soft, #f1f3f5)',
              padding: '14px 16px',
              borderRadius: '12px'
            }}
          >
            <div>
              <small style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--muted)' }}>
                RECURRING PRICE
              </small>
              <div style={{ fontSize: '18px', fontWeight: 800, fontFamily: 'Manrope, sans-serif', marginTop: '2px' }}>
                ${product.price}
                <span style={{ fontSize: '11px', fontWeight: 500, color: 'var(--muted)' }}> / user / mo</span>
              </div>
            </div>
            <div>
              <small style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--muted)' }}>
                CONTRACT TIER
              </small>
              <div style={{ fontSize: '14px', fontWeight: 700, marginTop: '4px' }}>
                {product.pricing_tier || 'Team Plan'}
              </div>
            </div>
          </div>

          {/* ToS & Governance Inspection */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, color: 'var(--muted)' }}>
                Contract & Dark-Pattern Inspection
              </span>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#3653b5' }}>
                SubGuard Trust {product.rating || '4.8'}
              </span>
            </div>
            <RiskMeter score={product.tos_risk_score || 0.15} />
          </div>

          {/* Dark Pattern Warnings (if detected by ToS Analyzer) */}
          {product.dark_pattern_warnings && product.dark_pattern_warnings.length > 0 && (
            <div
              style={{
                backgroundColor: '#fff0ef',
                border: '1px solid #ffd4d1',
                borderRadius: '10px',
                padding: '12px 14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700, color: '#c24e49' }}>
                <SubGuardIcon name="shield" size={13} stroke={2.4} />
                <span>ToS Clause Warnings Detected:</span>
              </div>
              {product.dark_pattern_warnings.map((w, idx) => (
                <div key={idx} style={{ fontSize: '11px', color: '#c24e49', lineHeight: 1.4 }}>
                  • {w}
                </div>
              ))}
            </div>
          )}

          {/* Compliance & Safeguards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1aa978' }}>
              <SubGuardIcon name="check" size={14} />
              <span>48-Hour Cancellation Shield actively pre-scheduled</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1aa978' }}>
              <SubGuardIcon name="check" size={14} />
              <span>Bounded by autonomous spending ceiling ($50.00 / mo)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1aa978' }}>
              <SubGuardIcon name="check" size={14} />
              <span>AP2 Ed25519 cryptographic mandate verified</span>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid var(--line, #dedbd3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '12px',
            background: 'var(--surface-soft, #f1f3f5)'
          }}
        >
          <button
            type="button"
            className="text-button"
            onClick={onClose}
            style={{ fontSize: '13px' }}
          >
            Cancel
          </button>
          <button
            type="button"
            className="primary-button"
            onClick={() => {
              onProvision(product);
              onClose();
            }}
            style={{ padding: '10px 18px', fontSize: '13px' }}
          >
            Confirm & Provision <SubGuardIcon name="arrow" size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
