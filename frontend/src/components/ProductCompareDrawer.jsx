import React from 'react';
import { X, Check, ArrowRight, Layers, AlertTriangle } from 'lucide-react';
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
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${items.length}, minmax(min(100%, 280px), 1fr))`,
            gap: '16px',
            overflowX: 'auto',
            paddingBottom: '6px'
          }}
        >
          {items.map((tool) => {
            const productName = tool.name || tool.product_name || 'Software Tool';
            const monthlyCost = Number(tool.monthly_cost ?? tool.price ?? 0);
            const isSoc2 = Boolean(tool.soc2_compliant);

            return (
              <div
                key={tool.product_id}
                style={{
                  backgroundColor: 'var(--surface)',
                  border: '1px solid var(--line)',
                  borderRadius: '12px',
                  padding: '14px 16px',
                  position: 'relative',
                  boxShadow: '0 4px 12px rgba(6, 7, 35, 0.05)'
                }}
              >
                <button
                  onClick={() => onRemoveItem(tool.product_id)}
                  aria-label={`Remove ${productName} from comparison`}
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

                <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--navy)', fontFamily: 'var(--font-sans)' }}>
                  {productName}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '2px' }}>
                  {tool.vendor_domain} · {tool.pricing_tier}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '12px 0', borderTop: '1px solid var(--line)', paddingTop: '10px' }}>
                  {/* Monthly Cost Metric */}
                  <div>
                    <div style={{ fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
                      Monthly Cost
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--navy)', fontVariantNumeric: 'tabular-nums', marginTop: '2px' }}>
                      ${monthlyCost.toFixed(2)}
                      <span style={{ fontSize: '10px', fontWeight: 500, color: 'var(--muted)', marginLeft: '2px' }}>/mo</span>
                    </div>
                  </div>

                  {/* Compliance Metric */}
                  <div>
                    <div style={{ fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
                      Compliance
                    </div>
                    <div
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        color: isSoc2 ? 'var(--green, #216e65)' : 'var(--trial-label-color, #92400e)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        marginTop: '2px'
                      }}
                    >
                      {isSoc2 ? (
                        <>
                          <Check size={13} strokeWidth={3} />
                          <span>SOC-2 Verified</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle size={12} strokeWidth={2.5} />
                          <span>Standard</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Contract Risk Metric */}
                  <div>
                    <div style={{ fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
                      Contract Risk
                    </div>
                    <div style={{ width: '90px', marginTop: '2px' }}>
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
            );
          })}
        </div>
      </div>
    </div>
  );
}

