import React from 'react';
import { X, Check, ArrowRight, Layers } from 'lucide-react';
import RiskMeter from './RiskMeter';

export default function ProductCompareDrawer({ items, onRemoveItem, onClearAll, onProvision }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="compare-drawer">
      <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ display: 'inline-flex', padding: '5px', borderRadius: '7px', backgroundColor: 'var(--surface-soft)', color: 'var(--blue)' }}>
              <Layers size={16} />
            </span>
            <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--navy)' }}>
              Product Comparison & Shortlist ({items.length}/3)
            </span>
            <span style={{ fontSize: '11px', color: 'var(--muted)' }}>Compare pricing, compliance, and contractual lock-in risks</span>
          </div>

          <button
            onClick={onClearAll}
            className="text-button"
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '11px',
              fontWeight: 600,
              color: 'var(--muted)',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            Clear All
          </button>
        </div>

        {/* Comparison Column Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${items.length}, minmax(280px, 1fr))`, gap: '16px' }}>
          {items.map((tool) => (
            <div
              key={tool.product_id}
              style={{
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--line)',
                borderRadius: '12px',
                padding: '14px 16px',
                position: 'relative',
                boxShadow: '0 4px 12px rgba(19, 35, 62, 0.05)'
              }}
            >
              <button
                onClick={() => onRemoveItem(tool.product_id)}
                aria-label={`Remove ${tool.product_name} from comparison`}
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--muted)',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                <X size={14} />
              </button>

              <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--navy)', fontFamily: 'Manrope, sans-serif' }}>
                {tool.product_name}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '2px' }}>
                {tool.vendor_domain} · {tool.pricing_tier}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '12px 0', borderTop: '1px solid var(--line)', paddingTop: '10px' }}>
                <div>
                  <div style={{ fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 700 }}>Monthly Cost</div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--navy)', fontVariantNumeric: 'tabular-nums' }}>
                    ${Number(tool.monthly_cost).toFixed(2)}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 700 }}>Compliance</div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: tool.soc2_compliant ? '#158763' : 'var(--muted)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    {tool.soc2_compliant ? <Check size={13} strokeWidth={3} /> : null}
                    {tool.soc2_compliant ? 'SOC-2 Verified' : 'Standard'}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 700 }}>Contract Risk</div>
                  <div style={{ width: '90px' }}>
                    <RiskMeter score={tool.tos_risk_score} size="compact" />
                  </div>
                </div>
              </div>

              <button
                onClick={() => onProvision(tool)}
                className="primary-button"
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '10px',
                  fontSize: '12px',
                  fontWeight: 600
                }}
              >
                <span>Provision Subscription</span>
                <ArrowRight size={13} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

