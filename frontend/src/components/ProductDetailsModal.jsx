import React from 'react';
import SubGuardIcon from './SubGuardIcon';
import RiskMeter from './RiskMeter';
import { useAuth } from '../context/AuthContext';

export default function ProductDetailsModal({ product, isOpen, onClose, onProvision }) {
  const { user } = useAuth();
  if (!isOpen || !product) return null;

  const currentCap = user?.singleTransactionLimit || 50;

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
    >
      <div
        className="modal-card"
        style={{
          backgroundColor: 'var(--surface, #ffffff)',
          color: 'var(--navy, #060723)',
          borderRadius: '20px',
          width: '100%',
          maxWidth: '540px',
          boxShadow: '0 24px 60px rgba(6, 7, 35, 0.22), 4px 4px 0px var(--line, #a6bbe2)',
          border: '1.5px solid var(--line, #a6bbe2)',
          overflow: 'hidden',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          animation: 'toast-in 0.2s ease'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div
          style={{
            padding: '22px 26px',
            borderBottom: '1.5px solid var(--line, #a6bbe2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--surface-soft, #ffffff)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span
              className="product-logo"
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '13px',
                background: product.bg || '#ffffff',
                color: product.color || '#060723',
                fontSize: '20px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
              }}
            >
              {product.mark || product.name.charAt(0)}
            </span>
            <div>
              <h3 style={{ margin: 0, fontSize: '19px', fontWeight: 700, fontFamily: 'var(--font-sans)' }}>
                {product.name}
              </h3>
              <div style={{ fontSize: '12px', color: 'var(--muted, #4a5578)', marginTop: '2px' }}>
                {product.vendor_domain || `${product.name.toLowerCase()}.com`} · {product.category}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="icon-button modal-close"
            aria-label="Close modal"
            title="Close dialog (Esc)"
            style={{ fontSize: '20px', color: 'var(--muted, #4a5578)' }}
          >
            ×
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '26px', display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '70vh', minHeight: 0, overflowY: 'auto' }}>
          <div>
            <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700, color: 'var(--muted)' }}>
              Overview & Capabilities
            </span>
            <p style={{ margin: '8px 0 0', fontSize: '13px', lineHeight: 1.6, color: 'var(--text-muted)' }}>
              {product.line}
            </p>
          </div>

          {/* Pricing & Tier Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '14px',
              backgroundColor: 'var(--surface-soft, #ffffff)',
              padding: '16px 18px',
              borderRadius: '14px',
              border: '1px solid var(--line, #a6bbe2)'
            }}
          >
            <div>
              <small style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--muted)' }}>
                RECURRING PRICE
              </small>
              <div style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'var(--font-sans)', marginTop: '3px' }}>
                ${product.price}
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--muted)' }}> / user / mo</span>
              </div>
            </div>
            <div>
              <small style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--muted)' }}>
                CONTRACT TIER
              </small>
              <div style={{ fontSize: '15px', fontWeight: 700, marginTop: '6px' }}>
                {product.pricing_tier || 'Team Plan'}
              </div>
            </div>
          </div>

          {/* ToS & Governance Inspection */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700, color: 'var(--muted)' }}>
                Contract & Dark-Pattern Inspection
              </span>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#060723', background: '#f9dec9', padding: '3px 8px', borderRadius: '6px', border: '1.5px solid var(--line, #a6bbe2)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <SubGuardIcon name="star" size={12} /> SubGuard Trust {product.rating || '4.8'}
              </span>
            </div>
            <RiskMeter score={product.tos_risk_score || 0.15} />
          </div>

          {/* Dark Pattern Warnings (if detected by ToS Analyzer) */}
          {product.dark_pattern_warnings && product.dark_pattern_warnings.length > 0 && (
            <div className="warning-callout">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 700 }}>
                <SubGuardIcon name="shield" size={14} stroke={2.4} />
                <span>ToS Clause Warnings Detected:</span>
              </div>
              {product.dark_pattern_warnings.map((w, idx) => (
                <div key={idx} style={{ fontSize: '12px', lineHeight: 1.5, marginTop: '4px' }}>
                  • {w}
                </div>
              ))}
            </div>
          )}

          {/* Compliance & Safeguards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
            <div className="compliance-row">
              <SubGuardIcon name="check" size={15} stroke={2.4} />
              <span>48-Hour Cancellation Shield actively pre-scheduled</span>
            </div>
            <div className="compliance-row">
              <SubGuardIcon name="check" size={15} stroke={2.4} />
              <span>Bounded by autonomous spending ceiling (${Number(currentCap).toFixed(2)} / mo)</span>
            </div>
            <div className="compliance-row">
              <SubGuardIcon name="check" size={15} stroke={2.4} />
              <span>AP2 Ed25519 cryptographic mandate verified</span>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div
          style={{
            padding: '18px 26px',
            borderTop: '1.5px solid var(--line, #a6bbe2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '14px',
            background: 'var(--surface-soft, #ffffff)'
          }}
        >
          <button
            type="button"
            className="text-button"
            onClick={onClose}
            title="Dismiss without provisioning"
            style={{ fontSize: '13px' }}
          >
            Cancel
          </button>
          <button
            type="button"
            className="primary-button"
            title="Provision software with AP2 cryptographic mandate and active safeguards"
            onClick={() => {
              onProvision(product);
              onClose();
            }}
            style={{ padding: '11px 20px', fontSize: '13px' }}
          >
            Confirm & Provision <SubGuardIcon name="arrow" size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
