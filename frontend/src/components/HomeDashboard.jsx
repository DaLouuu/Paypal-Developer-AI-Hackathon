import React from 'react';
import { DollarSign, Layers, Clock, ShieldAlert, ArrowRight, ShieldCheck, Sparkles, ChevronRight, AlertTriangle, Zap, CheckCircle2 } from 'lucide-react';

export default function HomeDashboard({ subscriptions, onNavigate, onApproveSuspension, onCancelSubscription }) {
  // Compute summary stats
  const totalBurn = subscriptions.reduce((sum, item) => sum + (Number(item.recurring_amount) || 0), 0);
  const activeCount = subscriptions.filter(item => item.status === 'ACTIVE_RECURRING' || item.status === 'TRIAL_ACTIVE').length;
  const trials = subscriptions.filter(item => item.status === 'TRIAL_ACTIVE' || item.is_trial);
  const suspended = subscriptions.filter(item => item.status === 'SUSPENDED_AWAITING_HUMAN');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Hero Welcome Banner */}
      <div
        style={{
          backgroundColor: '#0a1128',
          color: '#ffffff',
          borderRadius: '16px',
          padding: '32px 36px',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 12px 24px -4px rgba(10, 17, 40, 0.15)'
        }}
      >
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '640px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(105, 221, 255, 0.2)', border: '1px solid rgba(105, 221, 255, 0.4)', borderRadius: '6px', padding: '3px 9px', fontSize: '11px', fontWeight: 600, color: '#69ddff', marginBottom: '12px' }}>
            <Sparkles size={12} />
            <span>Autonomous SaaS Governance & Protection</span>
          </div>

          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.2 }}>
            Your software, under control.
          </h1>

          <p style={{ margin: '10px 0 20px 0', fontSize: '14px', color: '#001f54', lineHeight: 1.5 }}>
            Discover vetted SaaS tools with transparent contract risks, monitor active seat allocations, and let SubGuard automatically safeguard you from forgotten trials and auto-renewal traps.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            <button
              onClick={() => onNavigate('discover')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#69ddff',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 18px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(105, 221, 255, 0.35)'
              }}
            >
              <span>Explore Software Marketplace</span>
              <ArrowRight size={14} />
            </button>

            <button
              onClick={() => onNavigate('subscriptions')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                padding: '10px 18px',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer'
              }}
            >
              <span>View Active Subscriptions</span>
            </button>
          </div>
        </div>

        {/* Decorative background geometry */}
        <div
          style={{
            position: 'absolute',
            right: '-30px',
            top: '-30px',
            width: '260px',
            height: '260px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(105, 221, 255, 0.25) 0%, rgba(10, 17, 40, 0) 70%)',
            pointerEvents: 'none'
          }}
        />
      </div>

      {/* Section A: Financial Overview Cards */}
      <div>
        <h2 style={{ margin: '0 0 12px 0', fontSize: '15px', fontWeight: 700, color: '#0a1128' }}>
          Financial Overview
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          <div className="product-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#001f54', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Monthly Software Spend
              </span>
              <span style={{ padding: '6px', borderRadius: '6px', backgroundColor: '#ffffff', color: '#69ddff' }}>
                <DollarSign size={16} />
              </span>
            </div>
            <div className="tabular-nums" style={{ fontSize: '28px', fontWeight: 800, color: '#0a1128', marginTop: '6px' }}>
              ${totalBurn.toFixed(2)}
            </div>
            <div style={{ fontSize: '11px', color: '#001f54', marginTop: '4px' }}>
              Across {activeCount} active subscriptions
            </div>
          </div>

          <div className="product-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#001f54', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Active Subscriptions
              </span>
              <span style={{ padding: '6px', borderRadius: '6px', backgroundColor: '#5dfdcb', color: '#5dfdcb' }}>
                <Layers size={16} />
              </span>
            </div>
            <div className="tabular-nums" style={{ fontSize: '28px', fontWeight: 800, color: '#0a1128', marginTop: '6px' }}>
              {activeCount}
            </div>
            <div style={{ fontSize: '11px', color: '#001f54', marginTop: '4px' }}>
              Governed under AP2 spend caps
            </div>
          </div>

          <div className="product-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#001f54', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Trials In Progress
              </span>
              <span style={{ padding: '6px', borderRadius: '6px', backgroundColor: '#fee1c7', color: '#fee1c7' }}>
                <Clock size={16} />
              </span>
            </div>
            <div className="tabular-nums" style={{ fontSize: '28px', fontWeight: 800, color: trials.length > 0 ? '#fee1c7' : '#0a1128', marginTop: '6px' }}>
              {trials.length}
            </div>
            <div style={{ fontSize: '11px', color: '#001f54', marginTop: '4px' }}>
              48-hour auto-cancellation armed
            </div>
          </div>

          <div className="product-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#001f54', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Spending Safeguards
              </span>
              <span style={{ padding: '6px', borderRadius: '6px', backgroundColor: '#ffffff', color: '#69ddff' }}>
                <ShieldCheck size={16} />
              </span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#5dfdcb', marginTop: '8px' }}>
              ACTIVE
            </div>
            <div style={{ fontSize: '11px', color: '#001f54', marginTop: '4px' }}>
              $50.00 max single checkout ceiling
            </div>
          </div>
        </div>
      </div>

      {/* Section B: Attention Required (Actionable Alerts) */}
      {(suspended.length > 0 || trials.length > 0) && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
            <AlertTriangle size={16} color="#fee1c7" />
            <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0a1128' }}>
              Attention Required ({suspended.length + trials.length})
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* Suspended Agent Mandate Alert */}
            {suspended.map((item) => (
              <div
                key={item.id}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #fee1c7',
                  borderRadius: '10px',
                  padding: '16px 20px',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  boxShadow: '0 2px 4px rgba(254, 225, 199, 0.06)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#fee1c7', color: '#fee1c7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <ShieldAlert size={18} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 700, fontSize: '14px', color: '#0a1128' }}>{item.product_name}</span>
                      <span style={{ fontSize: '11px', fontWeight: 600, color: '#fee1c7', backgroundColor: '#fee1c7', padding: '1px 6px', borderRadius: '4px' }}>
                        Agent Over-Limit (${item.recurring_amount})
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#001f54', marginTop: '2px' }}>
                      Autonomous purchasing agent requested checkout exceeding your $50.00 ceiling. Requires founder authorization.
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onApproveSuspension && onApproveSuspension(item.id)}
                  style={{
                    backgroundColor: '#69ddff',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 14px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Approve Mandate
                </button>
              </div>
            ))}

            {/* Trial Approaching Conversion Alert */}
            {trials.map((item) => (
              <div
                key={item.id}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #fee1c7',
                  borderRadius: '10px',
                  padding: '16px 20px',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  boxShadow: '0 2px 4px rgba(254, 225, 199, 0.06)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#fee1c7', color: '#fee1c7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Clock size={18} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 700, fontSize: '14px', color: '#0a1128' }}>{item.product_name} Free Trial</span>
                      <span style={{ fontSize: '11px', fontWeight: 600, color: '#fee1c7', backgroundColor: '#fee1c7', padding: '1px 6px', borderRadius: '4px' }}>
                        Conversion Risk
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#001f54', marginTop: '2px' }}>
                      Converts to ${item.recurring_amount}/mo recurring billing in 4 days. 48-hour automated cancellation guard is armed.
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate('protection')}
                  style={{
                    backgroundColor: '#ffffff',
                    color: '#0a1128',
                    border: '1px solid #001f54',
                    borderRadius: '6px',
                    padding: '8px 14px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Review Protection Timeline
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section C: Quick Navigation Jump Points */}
      <div>
        <h2 style={{ margin: '0 0 12px 0', fontSize: '15px', fontWeight: 700, color: '#0a1128' }}>
          Quick Actions
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          <div
            onClick={() => onNavigate('discover')}
            className="product-card"
            style={{ padding: '20px', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#0a1128' }}>Discover Software</span>
                <ChevronRight size={16} color="#69ddff" />
              </div>
              <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#001f54', lineHeight: 1.4 }}>
                Search for verified SaaS tools by feature, price, SOC-2 compliance, and contract risk.
              </p>
            </div>
            <div style={{ marginTop: '16px', fontSize: '12px', fontWeight: 600, color: '#69ddff' }}>
              Open Marketplace →
            </div>
          </div>

          <div
            onClick={() => onNavigate('subscriptions')}
            className="product-card"
            style={{ padding: '20px', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#0a1128' }}>Manage Subscriptions</span>
                <ChevronRight size={16} color="#69ddff" />
              </div>
              <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#001f54', lineHeight: 1.4 }}>
                Review active licenses, monthly burn, seat allocations, and arm 1-click cancellation guards.
              </p>
            </div>
            <div style={{ marginTop: '16px', fontSize: '12px', fontWeight: 600, color: '#69ddff' }}>
              View Inventory →
            </div>
          </div>

          <div
            onClick={() => onNavigate('protection')}
            className="product-card"
            style={{ padding: '20px', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#0a1128' }}>Cancellation Shield</span>
                <ChevronRight size={16} color="#69ddff" />
              </div>
              <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#001f54', lineHeight: 1.4 }}>
                Inspect the multi-horizon timeline and configure automated 48-hour pre-renewal terminations.
              </p>
            </div>
            <div style={{ marginTop: '16px', fontSize: '12px', fontWeight: 600, color: '#69ddff' }}>
              Check Protection →
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

