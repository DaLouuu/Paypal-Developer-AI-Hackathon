import React, { useState, useMemo } from 'react';
import { Calendar, Shield, Clock, AlertOctagon, HelpCircle, CheckCircle2, ChevronRight, ShieldAlert, Lock, Zap, ArrowRight } from 'lucide-react';

export default function RenewalTimeline({ subscriptions }) {
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
      <div className="glass-panel" style={{ padding: '24px 28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: '#EFF3FE',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#4568F5'
                }}
              >
                <Shield size={18} strokeWidth={2.5} />
              </div>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#17243D', letterSpacing: '-0.01em' }}>
                Protection Center & Governance Guardrails
              </h2>
            </div>
            <p style={{ margin: '6px 0 0 0', fontSize: '13px', color: '#687F9E', maxWidth: '680px', lineHeight: 1.5 }}>
              SubGuard autonomously enforces your predefined financial limits, monitors subscription contractual terms, and triggers deterministic cancellations before renewal deadlines.
            </p>
          </div>

          {/* Active Policies Summary Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 600, color: '#188A60', backgroundColor: '#E4F8F1', border: '1px solid #B6EDD9', padding: '5px 12px', borderRadius: '100px' }}>
              <CheckCircle2 size={13} />
              <span>Guardrails: Active</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 600, color: '#4568F5', backgroundColor: '#EFF3FE', border: '1px solid #BCCCFB', padding: '5px 12px', borderRadius: '100px' }}>
              <Lock size={13} />
              <span>Spending Cap: $50.00 / mo</span>
            </div>
          </div>
        </div>

        {/* Protection System Metrics Bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginTop: '20px', paddingTop: '18px', borderTop: '1px solid #F0F3F8' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 600, color: '#687F9E', textTransform: 'uppercase' }}>Governed Spend</div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#17243D', marginTop: '2px' }}>$235.00 / mo</div>
            <div style={{ fontSize: '10px', color: '#687F9E' }}>Total recurring software commitments</div>
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 600, color: '#687F9E', textTransform: 'uppercase' }}>Autonomous Action Ceiling</div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#17243D', marginTop: '2px' }}>$50.00 per mandate</div>
            <div style={{ fontSize: '10px', color: '#687F9E' }}>Transactions above require human approval</div>
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 600, color: '#687F9E', textTransform: 'uppercase' }}>Cryptographic Verification</div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#22B982', marginTop: '2px' }}>AP2 Ed25519 Enforced</div>
            <div style={{ fontSize: '10px', color: '#687F9E' }}>Strict mandate signature authentication</div>
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 600, color: '#687F9E', textTransform: 'uppercase' }}>Cancellation Protection</div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#4568F5', marginTop: '2px' }}>48-Hour Auto-Shield</div>
            <div style={{ fontSize: '10px', color: '#687F9E' }}>Deterministic execution before rollover</div>
          </div>
        </div>
      </div>

      {/* Signature 48-Hour Cancellation Shield Showcase */}
      {shieldDetails ? (
        <div
          style={{
            background: 'linear-gradient(135deg, #17243D 0%, #20314F 100%)',
            borderRadius: '14px',
            padding: '24px 28px',
            color: '#ffffff',
            boxShadow: '0 6px 20px rgba(23, 36, 61, 0.12)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(69, 104, 245, 0.25)',
                  border: '1px solid rgba(69, 104, 245, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  flexShrink: 0
                }}
              >
                <Shield size={22} color="#22B982" strokeWidth={2.5} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#A5B7F9', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Signature Protection Mechanism
                  </span>
                  <span style={{ fontSize: '10px', backgroundColor: '#E9A23B', color: '#17243D', fontWeight: 700, padding: '1px 6px', borderRadius: '4px' }}>
                    ACTIVE MONITORING
                  </span>
                </div>
                <h3 style={{ margin: '4px 0 0 0', fontSize: '18px', fontWeight: 700, color: '#ffffff' }}>
                  48-Hour Cancellation Shield: {shieldDetails.productName}
                </h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#B6C4DB' }}>
                  Prevents unwanted conversion charges of <strong>${shieldDetails.cost}.00/mo</strong> when this trial concludes on <strong>{shieldDetails.renewalDate}</strong>.
                </p>
              </div>
            </div>

            {/* Countdown Badge */}
            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '10px', padding: '10px 18px', textAlign: 'center' }}>
              <div style={{ fontSize: '10px', color: '#A5B7F9', fontWeight: 600, textTransform: 'uppercase' }}>Shield Activates In</div>
              <div className="tabular-nums" style={{ fontSize: '20px', fontWeight: 700, color: '#ffffff', marginTop: '2px' }}>
                {shieldDetails.daysUntilTrigger}d {shieldDetails.hoursUntilTrigger % 24}h
              </div>
              <div style={{ fontSize: '10px', color: '#B6C4DB' }}>on {shieldDetails.triggerDate}</div>
            </div>
          </div>

          {/* 5-Step Protection Journey Bar */}
          <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)', borderRadius: '10px', padding: '14px 18px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
            <div style={{ fontSize: '11px' }}>
              <div style={{ color: '#22B982', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={13} /> 1. Trial Provisioned
              </div>
              <div style={{ color: '#B6C4DB', marginTop: '2px' }}>AP2 spending policy bounded</div>
            </div>
            <div style={{ fontSize: '11px' }}>
              <div style={{ color: '#22B982', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={13} /> 2. Contract Analyzed
              </div>
              <div style={{ color: '#B6C4DB', marginTop: '2px' }}>ToS terms & trap windows indexed</div>
            </div>
            <div style={{ fontSize: '11px' }}>
              <div style={{ color: '#E9A23B', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={13} /> 3. Shield Window (T-48h)
              </div>
              <div style={{ color: '#B6C4DB', marginTop: '2px' }}>Activates on {shieldDetails.triggerDate}</div>
            </div>
            <div style={{ fontSize: '11px' }}>
              <div style={{ color: '#A5B7F9', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Shield size={13} /> 4. Auto-Cancel Execution
              </div>
              <div style={{ color: '#B6C4DB', marginTop: '2px' }}>PayPal MCP API termination call</div>
            </div>
            <div style={{ fontSize: '11px' }}>
              <div style={{ color: '#A5B7F9', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Zap size={13} /> 5. Zero Rollover
              </div>
              <div style={{ color: '#B6C4DB', marginTop: '2px' }}>Account saved from $160+/yr traps</div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Multi-Horizon Visual Contract Timeline */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        {/* Header & Horizon Controls */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ display: 'inline-flex', padding: '4px', borderRadius: '6px', backgroundColor: '#EFF3FE', color: '#4568F5' }}>
                <Calendar size={16} />
              </span>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#17243D', letterSpacing: '-0.01em' }}>
                Contract Lifecycles & Scheduled Protection Timeline
              </h3>
            </div>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#687F9E' }}>
              Visual Gantt chart mapping active trial conversion dates, notice requirement windows, and automated termination triggers.
            </p>
          </div>

          {/* Horizon Tabs */}
          <div style={{ display: 'flex', backgroundColor: '#F0F3F8', padding: '3px', borderRadius: '8px', border: '1px solid #D0D9E7' }}>
            {[
              { id: '30d', label: '30 Days' },
              { id: '60d', label: '60 Days' },
              { id: '90d', label: '90 Days' },
              { id: 'annual', label: 'Annual' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setHorizon(tab.id)}
                style={{
                  border: 'none',
                  padding: '5px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: horizon === tab.id ? 600 : 500,
                  backgroundColor: horizon === tab.id ? '#ffffff' : 'transparent',
                  color: horizon === tab.id ? '#17243D' : '#687F9E',
                  cursor: 'pointer',
                  boxShadow: horizon === tab.id ? '0 1px 3px rgba(23, 36, 61, 0.08)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '11px', color: '#4C607C', marginBottom: '14px', flexWrap: 'wrap' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: '#FCF3E5', border: '1px solid #E9A23B' }} />
            Active Trial (Pre-conversion)
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: '#EFF3FE', border: '1px solid #4568F5' }} />
            Governed Recurring Term
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: '#FCEDED', border: '1px solid #D9535D' }} />
            Suspended Mandate (HITL)
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <Shield size={12} color="#22B982" />
            48h Cancellation Shield Trigger
          </span>
        </div>

        {/* Timeline Gantt Grid Container */}
        <div style={{ position: 'relative', marginTop: '10px' }}>
          {/* Date Axis Bar */}
          <div style={{ position: 'relative', height: '26px', borderBottom: '1px solid #D0D9E7', marginLeft: '220px', marginBottom: '10px' }}>
            {axisTicks.map((tick, idx) => (
              <div
                key={idx}
                style={{
                  position: 'absolute',
                  left: `${tick.percent}%`,
                  transform: idx === axisTicks.length - 1 ? 'translateX(-100%)' : (idx === 0 ? 'none' : 'translateX(-50%)'),
                  fontSize: '10px',
                  fontWeight: 600,
                  color: '#687F9E',
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
                    gridTemplateColumns: '220px 1fr',
                    alignItems: 'center',
                    backgroundColor: '#ffffff',
                    border: '1px solid #E1E8F0',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    transition: 'background-color 0.15s ease'
                  }}
                >
                  {/* Lane Label */}
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#17243D' }}>{sub.product_name}</span>
                    <span style={{ fontSize: '11px', color: '#687F9E' }}>
                      ${sub.recurring_amount}/mo · {sub.product_tier}
                    </span>
                  </div>

                  {/* Lane Track */}
                  <div style={{ position: 'relative', height: '34px', backgroundColor: '#FAFBFC', borderRadius: '6px', overflow: 'visible', border: '1px solid #F0F3F8' }}>
                    {/* Trial Window Bar */}
                    {isTrial && (
                      <div
                        style={{
                          position: 'absolute',
                          left: '0%',
                          width: `${endPercent}%`,
                          height: '24px',
                          top: '4px',
                          backgroundColor: '#FCF3E5',
                          border: '1px solid #F6D5A2',
                          borderRadius: '5px',
                          display: 'flex',
                          alignItems: 'center',
                          padding: '0 10px',
                          fontSize: '11px',
                          fontWeight: 600,
                          color: '#B5741B',
                          gap: '6px',
                          overflow: 'hidden'
                        }}
                      >
                        <Clock size={12} color="#E9A23B" />
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
                          backgroundColor: '#EFF3FE',
                          border: '1px solid #BCCCFB',
                          borderRadius: '5px',
                          display: 'flex',
                          alignItems: 'center',
                          padding: '0 10px',
                          fontSize: '11px',
                          fontWeight: 600,
                          color: '#4568F5',
                          gap: '6px',
                          overflow: 'hidden'
                        }}
                      >
                        <CheckCircle2 size={12} color="#22B982" />
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
                          backgroundColor: '#FCEDED',
                          border: '1px solid #FCDAD7',
                          borderRadius: '5px',
                          display: 'flex',
                          alignItems: 'center',
                          padding: '0 10px',
                          fontSize: '11px',
                          fontWeight: 600,
                          color: '#D9535D',
                          gap: '6px',
                          overflow: 'hidden'
                        }}
                      >
                        <ShieldAlert size={12} color="#D9535D" />
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
                          backgroundColor: '#22B982',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#ffffff',
                          boxShadow: '0 2px 6px rgba(34, 185, 130, 0.4)',
                          cursor: 'pointer',
                          zIndex: 10
                        }}
                      >
                        <Shield size={14} strokeWidth={2.5} />

                        {/* Tooltip */}
                        {activeTooltip === sub.id && (
                          <div
                            style={{
                              position: 'absolute',
                              bottom: '34px',
                              left: '50%',
                              transform: 'translateX(-50%)',
                              width: '240px',
                              backgroundColor: '#17243D',
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
                            <div style={{ fontWeight: 700, color: '#22B982', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Shield size={12} /> 48h Pre-Renewal Shield
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
  );
}
