import React, { useState, useMemo } from 'react';
import SubGuardIcon from './SubGuardIcon';

export default function RenewalTimeline({ subscriptions = [] }) {
  const [horizon, setHorizon] = useState('30d');
  const [activeTooltip, setActiveTooltip] = useState(null);

  const horizonDays = useMemo(() => {
    switch (horizon) {
      case '60d': return 60;
      case '90d': return 90;
      case 'annual': return 365;
      default: return 30;
    }
  }, [horizon]);

  const now = useMemo(() => new Date('2026-11-06T00:00:00Z'), []);

  // Compute date ticks for the axis
  const axisTicks = useMemo(() => {
    const ticks = [];
    const count = 5;
    for (let i = 0; i <= count; i++) {
      const dayOffset = Math.round((horizonDays / count) * i);
      const tickDate = new Date(now.getTime() + dayOffset * 24 * 3600 * 1000);
      ticks.push({
        percent: (i / count) * 100,
        label: i === 0 ? 'Today' : `+${dayOffset}d (${tickDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })})`,
      });
    }
    return ticks;
  }, [horizonDays, now]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Protection Center Header */}
      <div
        style={{
          padding: '24px 28px',
          background: 'var(--surface, #ffffff)',
          border: '1px solid var(--line, #1b1f9d)',
          borderRadius: '18px',
          boxShadow: '0 4px 18px rgba(6, 7, 35, 0.04)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(33, 110, 101, 0.12)',
                  display: 'grid',
                  placeItems: 'center',
                  color: 'var(--blue)'
                }}
              >
                <SubGuardIcon name="shield" size={19} stroke={2.4} />
              </span>
              <h2 style={{ margin: 0, fontSize: '19px', fontWeight: 700, fontFamily: 'var(--font-sans)' }}>
                Protection Center & Governance Guardrails
              </h2>
            </div>
            <p style={{ margin: '8px 0 0 0', fontSize: '13px', color: 'var(--muted)', maxWidth: '680px', lineHeight: 1.6 }}>
              SubGuard autonomously enforces your predefined financial limits, monitors subscription contractual terms, and triggers deterministic cancellations before renewal deadlines.
            </p>
          </div>

          {/* Active Policies Summary Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <div className="status-pill status-pill-active">
              <SubGuardIcon name="check" size={13} stroke={2.4} />
              <span>Guardrails: Active</span>
            </div>
            <div className="status-pill status-pill-blue">
              <SubGuardIcon name="card" size={13} />
              <span>Spending Cap: $50.00 / mo</span>
            </div>
          </div>
        </div>

        {/* Protection System Metrics Bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '16px', marginTop: '22px', paddingTop: '20px', borderTop: '1px solid var(--line)' }}>
          <div>
            <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Governed Spend</div>
            <div style={{ fontSize: '19px', fontWeight: 700, fontFamily: 'var(--font-sans)', marginTop: '3px' }}>$235.00 / mo</div>
            <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '2px' }}>Total recurring commitments</div>
          </div>
          <div>
            <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Autonomous Ceiling</div>
            <div style={{ fontSize: '19px', fontWeight: 700, fontFamily: 'var(--font-sans)', marginTop: '3px' }}>$50.00 per mandate</div>
            <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '2px' }}>Charges above require approval</div>
          </div>
          <div>
            <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Cryptographic Protocol</div>
            <div style={{ fontSize: '19px', fontWeight: 700, fontFamily: 'var(--font-sans)', color: 'var(--green, #2edcc4)', marginTop: '3px' }}>AP2 Ed25519 Enforced</div>
            <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '2px' }}>Strict mandate verification</div>
          </div>
          <div>
            <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Cancellation Protection</div>
            <div style={{ fontSize: '19px', fontWeight: 700, fontFamily: 'var(--font-sans)', color: 'var(--blue, #216e65)', marginTop: '3px' }}>48-Hour Auto-Shield</div>
            <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '2px' }}>Deterministic execution</div>
          </div>
        </div>
      </div>

      {/* Multi-Horizon Visual Contract Timeline */}
      <div
        style={{
          padding: '24px 28px',
          background: 'var(--surface, #ffffff)',
          border: '1px solid var(--line, #1b1f9d)',
          borderRadius: '18px',
          boxShadow: '0 4px 18px rgba(6, 7, 35, 0.04)'
        }}
      >
        {/* Header & Horizon Controls */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '22px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <SubGuardIcon name="calendar" size={17} />
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 700, fontFamily: 'var(--font-sans)' }}>
                Contract Lifecycles & Scheduled Protection Timeline
              </h3>
            </div>
            <p style={{ margin: '6px 0 0 0', fontSize: '13px', color: 'var(--muted)' }}>
              Visual Gantt chart mapping active trial conversion dates, notice requirement windows, and automated termination triggers.
            </p>
          </div>

          {/* Horizon Tabs */}
          <div style={{ display: 'flex', backgroundColor: 'var(--surface-soft, #ffffff)', padding: '4px', borderRadius: '10px', border: '1px solid var(--line)' }}>
            {[
              { id: '30d', label: '30 Days' },
              { id: '60d', label: '60 Days' },
              { id: '90d', label: '90 Days' },
              { id: 'annual', label: 'Annual' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`horizon-btn ${horizon === tab.id ? 'active' : ''}`}
                onClick={() => setHorizon(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px', fontSize: '11px', color: 'var(--muted)', marginBottom: '16px', flexWrap: 'wrap' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: '#f9dec9', border: '1px solid #f9dec9' }} />
            Active Trial (Pre-conversion)
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: '#2edcc4', border: '1px solid #2edcc4' }} />
            Governed Recurring Term
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: '#f9dec9', border: '1px solid #f9dec9' }} />
            Suspended Mandate (HITL)
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <SubGuardIcon name="shield" size={13} />
            48h Cancellation Shield Trigger
          </span>
        </div>

        {/* Responsive Horizontal Scroll Container */}
        <div style={{ overflowX: 'auto', paddingBottom: '6px' }}>
          <div style={{ minWidth: '600px', position: 'relative', marginTop: '10px' }}>
            {/* Date Axis Bar */}
            <div style={{ position: 'relative', height: '28px', borderBottom: '1px solid var(--line)', marginLeft: '190px', marginBottom: '12px' }}>
              {axisTicks.map((tick, idx) => (
                <div
                  key={idx}
                  style={{
                    position: 'absolute',
                    left: `${tick.percent}%`,
                    transform: idx === axisTicks.length - 1 ? 'translateX(-100%)' : (idx === 0 ? 'none' : 'translateX(-50%)'),
                    fontSize: '11px',
                    fontWeight: 700,
                    color: 'var(--muted)',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {tick.label}
                </div>
              ))}
            </div>

            {/* Timeline Lanes */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {subscriptions.map((sub) => {
                const isTrial = sub.status === 'TRIAL_ACTIVE' || sub.is_trial;
                const isSuspended = sub.status === 'SUSPENDED_AWAITING_HUMAN';

                // Calculate date offsets relative to horizon
                let targetDate = sub.next_billing_date ? new Date(sub.next_billing_date) : new Date(now.getTime() + 15 * 86400000);
                const daysFromNow = Math.max(1, Math.min(horizonDays, (targetDate.getTime() - now.getTime()) / (1000 * 3600 * 24)));
                const endPercent = Math.min(100, Math.max(22, (daysFromNow / horizonDays) * 100));

                return (
                  <div
                    key={sub.id}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '190px 1fr',
                      alignItems: 'center',
                      backgroundColor: 'var(--surface-soft, #ffffff)',
                      border: '1px solid var(--line)',
                      borderRadius: '12px',
                      padding: '10px 14px'
                    }}
                  >
                    {/* Lane Label */}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--navy)' }}>{sub.product_name}</span>
                      <span style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '2px' }}>
                        ${sub.recurring_amount}/mo · {sub.product_tier}
                      </span>
                    </div>

                    {/* Lane Track */}
                    <div className="timeline-track" style={{ position: 'relative', height: '36px', borderRadius: '8px', overflow: 'visible', border: '1px solid var(--line)' }}>
                      {/* Trial Window Bar */}
                      {isTrial && (
                        <div
                          className="timeline-bar timeline-bar-trial"
                          style={{ width: `${endPercent}%`, paddingRight: '32px' }}
                        >
                          <SubGuardIcon name="clock" size={13} style={{ flexShrink: 0 }} />
                          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {endPercent < 28 ? `${daysFromNow.toFixed(0)}d trial` : `Trial Active (${daysFromNow.toFixed(0)}d remaining)`}
                          </span>
                        </div>
                      )}

                      {/* Recurring Active Bar */}
                      {!isTrial && !isSuspended && (
                        <div
                          className="timeline-bar timeline-bar-active"
                          style={{ width: `${endPercent}%` }}
                        >
                          <SubGuardIcon name="check" size={13} stroke={2.4} style={{ flexShrink: 0 }} />
                          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {endPercent < 28 ? `${daysFromNow.toFixed(0)}d renewal` : `Current Cycle (${daysFromNow.toFixed(0)}d to renewal)`}
                          </span>
                        </div>
                      )}

                      {/* Suspended Bar */}
                      {isSuspended && (
                        <div
                          className="timeline-bar timeline-bar-suspended"
                          style={{ width: `${endPercent}%` }}
                        >
                          <SubGuardIcon name="shield" size={13} style={{ flexShrink: 0 }} />
                          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {endPercent < 30 ? 'Suspended (HITL)' : 'Suspended: Awaiting Human Authorization'}
                          </span>
                        </div>
                      )}

                      {/* 48-Hour Cancellation Shield Trigger Indicator */}
                      {isTrial && (
                        <div
                          onMouseEnter={() => setActiveTooltip(sub.id)}
                          onMouseLeave={() => setActiveTooltip(null)}
                          style={{
                            position: 'absolute',
                            left: `calc(${endPercent}% - 14px)`,
                            top: '5px',
                            width: '26px',
                            height: '26px',
                            borderRadius: '50%',
                            backgroundColor: '#2edcc4',
                            display: 'grid',
                            placeItems: 'center',
                            color: '#060723',
                            border: '1.5px solid #060723',
                            boxShadow: '0 2px 8px rgba(46, 220, 196, 0.45)',
                            cursor: 'pointer',
                            zIndex: 10
                          }}
                        >
                          <SubGuardIcon name="shield" size={14} stroke={2.4} />

                          {/* Tooltip */}
                          {activeTooltip === sub.id && (
                            <div className="timeline-tooltip">
                              <div style={{ fontWeight: 700, color: '#2edcc4', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <SubGuardIcon name="shield" size={12} /> 48h Pre-Renewal Shield
                              </div>
                              <div>
                                Scheduled for {new Date(new Date(sub.next_billing_date).getTime() - 48 * 3600 * 1000).toLocaleDateString()}.
                                If no team confirmation is received, SubGuard automatically issues a PayPal cancellation request.
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
