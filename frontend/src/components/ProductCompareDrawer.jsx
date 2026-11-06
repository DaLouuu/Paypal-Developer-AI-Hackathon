import React from 'react';
import { X, Check, ShieldCheck, ArrowRight, Layers } from 'lucide-react';
import RiskMeter from './RiskMeter';

export default function ProductCompareDrawer({ items, onRemoveItem, onClearAll, onProvision }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="compare-drawer">
      <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ display: 'inline-flex', padding: '4px', borderRadius: '6px', backgroundColor: '#F0F3F8', color: '#4568F5' }}>
              <Layers size={16} />
            </span>
            <span style={{ fontSize: '14px', fontWeight: 700, color: '#17243D' }}>
              Product Comparison & Shortlist ({items.length}/3)
            </span>
            <span style={{ fontSize: '11px', color: '#64748B' }}>Compare pricing, compliance, and contractual lock-in risks</span>
          </div>

          <button
            onClick={onClearAll}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '11px',
              fontWeight: 600,
              color: '#64748B',
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
                backgroundColor: '#FAFBFC',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                padding: '12px 14px',
                position: 'relative'
              }}
            >
              <button
                onClick={() => onRemoveItem(tool.product_id)}
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  border: 'none',
                  background: 'transparent',
                  color: '#94A3B8',
                  cursor: 'pointer',
                  padding: '2px'
                }}
              >
                <X size={14} />
              </button>

              <div style={{ fontWeight: 700, fontSize: '14px', color: '#17243D' }}>{tool.product_name}</div>
              <div style={{ fontSize: '11px', color: '#64748B' }}>{tool.vendor_domain} · {tool.pricing_tier}</div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '10px 0', borderTop: '1px solid #E2E8F0', paddingTop: '8px' }}>
                <div>
                  <div style={{ fontSize: '10px', color: '#64748B', textTransform: 'uppercase' }}>Monthly Cost</div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#17243D', fontVariantNumeric: 'tabular-nums' }}>
                    ${Number(tool.monthly_cost).toFixed(2)}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '10px', color: '#64748B', textTransform: 'uppercase' }}>Compliance</div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: tool.soc2_compliant ? '#22B982' : '#64748B', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    {tool.soc2_compliant ? <Check size={13} strokeWidth={3} /> : null}
                    {tool.soc2_compliant ? 'SOC-2 Verified' : 'Standard'}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '10px', color: '#64748B', textTransform: 'uppercase' }}>Contract Risk</div>
                  <div style={{ width: '90px' }}>
                    <RiskMeter score={tool.tos_risk_score} size="compact" />
                  </div>
                </div>
              </div>

              <button
                onClick={() => onProvision(tool)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  border: 'none',
                  backgroundColor: '#4568F5',
                  color: '#ffffff',
                  borderRadius: '6px',
                  padding: '8px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer'
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
