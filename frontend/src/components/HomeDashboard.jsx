import React from 'react';
import { DollarSign, Layers, Clock, ShieldAlert, ArrowRight, ShieldCheck, ChevronRight, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function HomeDashboard({ subscriptions, onNavigate, onApproveSuspension }) {
  const totalBurn = subscriptions.reduce((sum, item) => sum + (Number(item.recurring_amount) || 0), 0);
  const activeCount = subscriptions.filter(item => item.status === 'ACTIVE_RECURRING' || item.status === 'TRIAL_ACTIVE').length;
  const trials = subscriptions.filter(item => item.status === 'TRIAL_ACTIVE' || item.is_trial);
  const suspended = subscriptions.filter(item => item.status === 'SUSPENDED_AWAITING_HUMAN');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Action Bar / Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px',
          paddingBottom: '16px',
          borderBottom: '1.5px solid var(--line)'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700, fontFamily: 'var(--font-sans)', color: 'var(--navy)' }}>
              Executive Dashboard
            </h1>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '3px 8px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 700,
                fontFamily: 'var(--font-sans)',
                backgroundColor: 'rgba(46, 220, 196, 0.15)',
                color: 'var(--green, #216e65)',
                border: '1px solid var(--green, #216e65)'
              }}
            >
              <CheckCircle2 size={12} />
              AP2 AUTOPILOT ACTIVE
            </span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted, #1b1f9d)', marginTop: '4px', fontFamily: 'var(--font-sans)' }}>
            Organization: alex.morgan@passport · Ceiling: $50.00/tx · FastMCP Gateway: 8000
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => onNavigate('discover')}
            className="primary-button"
            style={{ padding: '8px 16px', fontSize: '13px' }}
          >
            <span>+ Provision Software</span>
          </button>
          <button
            onClick={() => onNavigate('subscriptions')}
            className="outline-button"
            style={{ padding: '8px 16px', fontSize: '13px' }}
          >
            <span>Subscription Ledger</span>
          </button>
        </div>
      </div>

      {/* Financial Overview Metrics (4 Columns) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
        <div className="product-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-sans)' }}>
              Monthly Spend
            </span>
            <span style={{ padding: '4px', borderRadius: '5px', backgroundColor: '#f9dec9', color: '#060723', border: '1px solid #1b1f9d' }}>
              <DollarSign size={14} />
            </span>
          </div>
          <div className="tabular-nums" style={{ fontSize: '26px', fontWeight: 700, fontFamily: 'var(--font-sans)', color: 'var(--navy)', marginTop: '10px' }}>
            ${totalBurn.toFixed(2)}
          </div>
        </div>

        <div className="product-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-sans)' }}>
              Active Contracts
            </span>
            <span style={{ padding: '4px', borderRadius: '5px', backgroundColor: '#2edcc4', color: '#060723', border: '1px solid #060723' }}>
              <Layers size={14} />
            </span>
          </div>
          <div className="tabular-nums" style={{ fontSize: '26px', fontWeight: 700, fontFamily: 'var(--font-sans)', color: 'var(--navy)', marginTop: '10px' }}>
            {activeCount} Plans
          </div>
        </div>

        <div className="product-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-sans)' }}>
              Watched Trials
            </span>
            <span style={{ padding: '4px', borderRadius: '5px', backgroundColor: '#f9dec9', color: '#060723', border: '1px solid #1b1f9d' }}>
              <Clock size={14} />
            </span>
          </div>
          <div className="tabular-nums" style={{ fontSize: '26px', fontWeight: 700, fontFamily: 'var(--font-sans)', color: 'var(--navy)', marginTop: '10px' }}>
            {trials.length} Active
          </div>
        </div>

        <div className="product-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-sans)' }}>
              Spend Ceiling
            </span>
            <span style={{ padding: '4px', borderRadius: '5px', backgroundColor: '#2edcc4', color: '#060723', border: '1px solid #060723' }}>
              <ShieldCheck size={14} />
            </span>
          </div>
          <div className="tabular-nums" style={{ fontSize: '26px', fontWeight: 700, fontFamily: 'var(--font-sans)', color: 'var(--navy)', marginTop: '10px' }}>
            $50.00 <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--muted)' }}>/ tx</span>
          </div>
        </div>
      </div>

      {/* Actionable Alerts (Only shown if pending items exist) */}
      {(suspended.length > 0 || trials.length > 0) && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={15} color="#1b1f9d" />
            <span style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--navy)', fontFamily: 'var(--font-sans)' }}>
              Pending Items ({suspended.length + trials.length})
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {/* Suspended Agent Mandates */}
            {suspended.map((item) => (
              <div
                key={item.id}
                style={{
                  backgroundColor: 'var(--surface)',
                  border: '1.5px solid var(--line)',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  boxShadow: '2px 2px 0px var(--line)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '6px', backgroundColor: '#f9dec9', color: '#060723', border: '1.5px solid #1b1f9d', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <ShieldAlert size={16} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <strong style={{ fontSize: '14px', color: 'var(--navy)' }}>{item.product_name}</strong>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#060723', backgroundColor: '#f9dec9', border: '1px solid #1b1f9d', padding: '1px 6px', borderRadius: '4px' }}>
                        Agent Over-Limit (${item.recurring_amount})
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>
                      Requested checkout exceeds $50.00 autonomous ceiling · Requires authorization
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onApproveSuspension && onApproveSuspension(item.id)}
                  style={{
                    backgroundColor: '#1b1f9d',
                    color: '#ffffff',
                    border: '1.5px solid #060723',
                    borderRadius: '6px',
                    padding: '7px 14px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '2px 2px 0px #060723'
                  }}
                >
                  Authorize Mandate
                </button>
              </div>
            ))}

            {/* Trial Conversion Warnings */}
            {trials.map((item) => (
              <div
                key={item.id}
                style={{
                  backgroundColor: 'var(--surface)',
                  border: '1.5px solid var(--line)',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  boxShadow: '2px 2px 0px var(--line)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '6px', backgroundColor: '#2edcc4', color: '#060723', border: '1.5px solid #060723', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Clock size={16} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <strong style={{ fontSize: '14px', color: 'var(--navy)' }}>{item.product_name} Free Trial</strong>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#060723', backgroundColor: '#2edcc4', border: '1px solid #060723', padding: '1px 6px', borderRadius: '4px' }}>
                        4-Day Warning
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>
                      Converts to ${item.recurring_amount}/mo · 48h automated cancellation guard armed
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate('protection')}
                  style={{
                    backgroundColor: 'var(--surface)',
                    color: 'var(--navy)',
                    border: '1.5px solid var(--line)',
                    borderRadius: '6px',
                    padding: '7px 14px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '2px 2px 0px var(--line)'
                  }}
                >
                  View Timeline →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Control Jump Points (3 Flat Cards) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
        <div
          onClick={() => onNavigate('discover')}
          className="product-card"
          style={{ padding: '16px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--navy)' }}>Software Catalog</div>
            <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>7 verified SaaS platforms audited</div>
          </div>
          <ChevronRight size={18} color="var(--line)" />
        </div>

        <div
          onClick={() => onNavigate('subscriptions')}
          className="product-card"
          style={{ padding: '16px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--navy)' }}>Subscription Ledger</div>
            <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>{activeCount} active plans · ${totalBurn.toFixed(2)}/mo</div>
          </div>
          <ChevronRight size={18} color="var(--line)" />
        </div>

        <div
          onClick={() => onNavigate('protection')}
          className="product-card"
          style={{ padding: '16px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--navy)' }}>Cancellation Autopilot</div>
            <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>48h pre-conversion shield active</div>
          </div>
          <ChevronRight size={18} color="var(--line)" />
        </div>
      </div>
    </div>
  );
}

