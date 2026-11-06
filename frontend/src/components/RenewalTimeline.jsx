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

  // Find subscription closest to trial conversion for the Signature Shield widget
  const trialSub = useMemo(() => {
    return subscriptions.find(s => s.status === 'TRIAL_ACTIVE' || s.is_trial);
  }, [subscriptions]);

  // Calculate hours remaining until 48-hour trigger
  const shieldDetails = useMemo(() => {
    if (!trialSub || !trialSub.next_billing_date) return null;
    const renewalDate = new Date(trialSub.next_billing_date);
    const triggerDate = new Date(renewalDate.getTime() - 48 * 3600 * 1000);
    const msUntilTrigger = triggerDate.getTime() - now.getTime();
    const hoursUntilTrigger = Math.max(0, Math.floor(msUntilTrigger / (3600 * 1000)));
    const daysUntilTrigger = Math.floor(hoursUntilTrigger / 24);

    return {
      productName: trialSub.product_name,
      renewalDate: renewalDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
      triggerDate: triggerDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      hoursUntilTrigger,
      daysUntilTrigger,
      status: trialSub.status,
      cost: trialSub.recurring_amount
    };
  }, [trialSub, now]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Protection Center Header */}
      <div
        style={{
          padding: '24px',
          background: 'var(--surface, #ffffff)',
          border: '1px solid var(--line, #dedbd3)',
          borderRadius: '18px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '9px',
                  backgroundColor: 'rgba(63, 100, 255, 0.1)',
                  display: 'grid',
                  placeItems: 'center',
                  color: 'var(--blue)'
                }}
              >
                <SubGuardIcon name="shield" size={18} stroke={2.4} />
              </span>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800, fontFamily: 'Manrope, sans-serif' }}>
                Protection Center & Governance Guardrails
              </h2>
            </div>
            <p style={{ margin: '6px 0 0 0', fontSize: '13px', color: 'var(--muted)', maxWidth: '680px', lineHeight: 1.5 }}>
              SubGuard autonomously enforces your predefined financial limits, monitors subscription contractual terms, and triggers deterministic cancellations before renewal deadlines.
            </p>
          </div>

          {/* Active Policies Summary Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700, color: '#158763', backgroundColor: '#eaf8f2', padding: '6px 12px', borderRadius: '100px' }}>
              <SubGuardIcon name="check" size={13} />
              <span>Guardrails: Active</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700, color: 'var(--blue)', backgroundColor: 'rgba(63, 100, 255, 0.1)', padding: '6px 12px', borderRadius: '100px' }}>
              <SubGuardIcon name="card" size={13} />
              <span>Spending Cap: $50.00 / mo</span>
            </div>
          </div>
        </div>

        {/* Protection System Metrics Bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginTop: '20px', paddingTop: '18px', borderTop: '1px solid var(--line)' }}>
          <div>
            <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Governed Spend</div>
            <div style={{ fontSize: '18px', fontWeight: 800, fontFamily: 'Manrope', marginTop: '2px' }}>$235.00 / mo</div>
            <div style={{ fontSize: '10px', color: 'var(--muted)' }}>Total recurring commitments</div>
          </div>
          <div>
            <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Autonomous Ceiling</div>
            <div style={{ fontSize: '18px', fontWeight: 800, fontFamily: 'Manrope', marginTop: '2px' }}>$50.00 per mandate</div>
            <div style={{ fontSize: '10px', color: 'var(--muted)' }}>Charges above require approval</div>
          </div>
          <div>
            <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Cryptographic Protocol</div>
            <div style={{ fontSize: '18px', fontWeight: 800, fontFamily: 'Manrope', color: '#158763', marginTop: '2px' }}>AP2 Ed25519 Enforced</div>
            <div style={{ fontSize: '10px', color: 'var(--muted)' }}>Strict mandate verification</div>
          </div>
          <div>
            <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Cancellation Protection</div>
            <div style={{ fontSize: '18px', fontWeight: 800, fontFamily: 'Manrope', color: 'var(--blue)', marginTop: '2px' }}>48-Hour Auto-Shield</div>
            <div style={{ fontSize: '10px', color: 'var(--muted)' }}>Deterministic execution</div>
          </div>
        </div>
      </div>

      {/* Multi-Horizon Visual Contract Timeline */}
      <div
        style={{
          padding: '24px',
          background: 'var(--surface, #ffffff)',
          border: '1px solid var(--line, #dedbd3)',
          borderRadius: '18px'
        }}
      >
        {/* Header & Horizon Controls */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <SubGuardIcon name="calendar" size={16} />
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, fontFamily: 'Manrope' }}>
                Contract Lifecycles & Scheduled Protection Timeline
              </h3>
            </div>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--muted)' }}>
              Visual Gantt chart mapping active trial conversion dates, notice requirement windows, and automated termination triggers.
            </p>
          </div>

          {/* Horizon Tabs */}
          <div style={{ display: 'flex', backgroundColor: 'var(--surface-soft, #f1f3f5)', padding: '3px', borderRadius: '10px', border: '1px solid var(--line)' }}>
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
                style={{
                  border: 'none',
                  padding: '5px 12px',
                  borderRadius: '7px',
                  fontSize: '11px',
                  fontWeight: horizon === tab.id ? 700 : 500,
                  backgroundColor: horizon === tab.id ? 'var(--navy)' : 'transparent',
                  color: horizon === tab.id ? '#ffffff' : 'var(--muted)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '11px', color: 'var(--muted)', marginBottom: '14px', flexWrap: 'wrap' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: '#fff5dc', border: '1px solid #e5d9be' }} />
            Active Trial (Pre-conversion)
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: '#eaf8f2', border: '1px solid #b6edd9' }} />
            Governed Recurring Term
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: '#fff0ef', border: '1px solid #ffd4d1' }} />
            Suspended Mandate (HITL)
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <SubGuardIcon name="shield" size={13} />
            48h Cancellation Shield Trigger
          </span>
        </div>

        {/* Responsive Horizontal Scroll Container */}
        <div style={{ overflowX: 'auto', paddingBottom: '6px' }}>
          <div style={{ minWidth: '600px', position: 'relative', marginTop: '10px' }}>
            {/* Date Axis Bar */}
            <div style={{ position: 'relative', height: '26px', borderBottom: '1px solid var(--line)', marginLeft: '190px', marginBottom: '10px' }}>
              {axisTicks.map((tick, idx) => (
                <div
                  key={idx}
                  style={{
                    position: 'absolute',
                    left: `${tick.percent}%`,
                    transform: idx === axisTicks.length - 1 ? 'translateX(-100%)' : (idx === 0 ? 'none' : 'translateX(-50%)'),
                    fontSize: '10px',
                    fontWeight: 600,
                    color: 'var(--muted)',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {tick.label}
                </div>
              ))}
            </div>

            {/* Timeline Lanes */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {subscriptions.map((sub) => {
                const isTrial = sub.status === 'TRIAL_ACTIVE' || sub.is_trial;
                const isSuspended = sub.status === 'SUSPENDED_AWAITING_HUMAN';

                // Calculate date offsets relative to horizon
                let targetDate = sub.next_billing_date ? new Date(sub.next_billing_date) : new Date(now.getTime() + 15 * 86400000);
                const daysFromNow = Math.max(1, Math.min(horizonDays, (targetDate.getTime() - now.getTime()) / (1000 * 3600 * 24)));
                const endPercent = Math.min(100, Math.max(10, (daysFromNow / horizonDays) * 100));

                return (
                  <div
                    key={sub.id}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '190px 1fr',
                      alignItems: 'center',
                      backgroundColor: 'var(--surface-soft, #f1f3f5)',
                      border: '1px solid var(--line)',
                      borderRadius: '10px',
                      padding: '8px 12px'
                    }}
                  >
                    {/* Lane Label */}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--navy)' }}>{sub.product_name}</span>
                      <span style={{ fontSize: '11px', color: 'var(--muted)' }}>
                        ${sub.recurring_amount}/mo · {sub.product_tier}
                      </span>
                    </div>

                    {/* Lane Track */}
                    <div style={{ position: 'relative', height: '34px', backgroundColor: 'var(--surface, #ffffff)', borderRadius: '6px', overflow: 'visible', border: '1px solid var(--line)' }}>
                      {/* Trial Window Bar */}
                      {isTrial && (
                        <div
                          style={{
                            position: 'absolute',
                            left: '0%',
                            width: `${endPercent}%`,
                            height: '24px',
                            top: '4px',
                            backgroundColor: '#fff5dc',
                            border: '1px solid #f6d5a2',
                            borderRadius: '5px',
                            display: 'flex',
                            alignItems: 'center',
                            padding: '0 10px',
                            fontSize: '11px',
                            fontWeight: 600,
                            color: '#a16a0b',
                            gap: '6px',
                            overflow: 'hidden'
                          }}
                        >
                          <SubGuardIcon name="clock" size={12} />
                          <span>Trial Active ({daysFromNow.toFixed(0)}d remaining)</span>
                        </div>
                      )}

                      {/* Recurring Active Bar */}
                      {!isTrial && !isSuspended && (
                        <div
                          style={{
                            position: 'absolute',
                            left: '0%',
                            width: `${endPercent}%`,
                            height: '24px',
                            top: '4px',
                            backgroundColor: '#eaf8f2',
                            border: '1px solid #b6edd9',
                            borderRadius: '5px',
                            display: 'flex',
                            alignItems: 'center',
                            padding: '0 10px',
                            fontSize: '11px',
                            fontWeight: 600,
                            color: '#158763',
                            gap: '6px',
                            overflow: 'hidden'
                          }}
                        >
                          <SubGuardIcon name="check" size={12} />
                          <span>Current Cycle ({daysFromNow.toFixed(0)}d to renewal)</span>
                        </div>
                      )}

                      {/* Suspended Bar */}
                      {isSuspended && (
                        <div
                          style={{
                            position: 'absolute',
                            left: '0%',
                            width: `${endPercent}%`,
                            height: '24px',
                            top: '4px',
                            backgroundColor: '#fff0ef',
                            border: '1px solid #ffd4d1',
                            borderRadius: '5px',
                            display: 'flex',
                            alignItems: 'center',
                            padding: '0 10px',
                            fontSize: '11px',
                            fontWeight: 600,
                            color: '#c24e49',
                            gap: '6px',
                            overflow: 'hidden'
                          }}
                        >
                          <SubGuardIcon name="shield" size={12} />
                          <span>Suspended: Awaiting Human Authorization</span>
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
                            top: '4px',
                            width: '26px',
                            height: '26px',
                            borderRadius: '50%',
                            backgroundColor: '#2bbf88',
                            display: 'grid',
                            placeItems: 'center',
                            color: '#ffffff',
                            boxShadow: '0 2px 6px rgba(43, 191, 136, 0.4)',
                            cursor: 'pointer',
                            zIndex: 10
                          }}
                        >
                          <SubGuardIcon name="shield" size={14} stroke={2.4} />

                          {/* Tooltip */}
                          {activeTooltip === sub.id && (
                            <div
                              style={{
                                position: 'absolute',
                                bottom: '34px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: '240px',
                                backgroundColor: 'var(--navy, #13233e)',
                                color: '#ffffff',
                                padding: '10px 12px',
                                borderRadius: '8px',
                                fontSize: '11px',
                                lineHeight: 1.4,
                                boxShadow: '0 8px 20px rgba(0,0,0,0.25)',
                                pointerEvents: 'none',
                                zIndex: 100
                              }}
                            >
                              <div style={{ fontWeight: 700, color: '#2bbf88', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
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
