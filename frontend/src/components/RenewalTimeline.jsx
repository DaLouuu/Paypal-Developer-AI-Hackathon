import React, { useState, useMemo } from 'react';
import { Calendar, Shield, Clock, AlertOctagon, HelpCircle, CheckCircle2, ChevronRight } from 'lucide-react';

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

  return (
    <div className="glass-panel" style={{ padding: '24px' }}>
      {/* Header & Horizon Controls */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ display: 'inline-flex', padding: '4px', borderRadius: '6px', backgroundColor: '#eff6ff', color: '#2563eb' }}>
              <Calendar size={16} />
            </span>
            <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.01em' }}>
              Contract Lifecycle & 48-Hour Cancellation Guard Timeline
            </h2>
          </div>
          <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#64748b' }}>
            Multi-horizon visual timeline mapping trial conversions, notice restriction windows, and automated termination triggers.
          </p>
        </div>

        {/* Horizon Tabs */}
        <div style={{ display: 'flex', backgroundColor: '#f1f5f9', padding: '3px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
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
                color: horizon === tab.id ? '#0f172a' : '#64748b',
                cursor: 'pointer',
                boxShadow: horizon === tab.id ? '0 1px 2px rgba(15, 23, 42, 0.08)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Signature 48-Hour Cancellation Banner */}
      <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            className="shield-pulse-anim"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#dc2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 2px 6px rgba(220, 38, 38, 0.35)',
              flexShrink: 0
            }}
          >
            <Shield size={16} strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>
              Autonomous 48-Hour Trial Guard Active
            </div>
            <div style={{ fontSize: '11px', color: '#64748b' }}>
              SubGuard schedules deterministic pre-renewal cancellation guards 48 hours prior to trial conversion, preventing $160+/yr unwanted billing.
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '11px', color: '#475569' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: '#fde68a', border: '1px solid #f59e0b' }} />
            Active Trial
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: '#dbeafe', border: '1px solid #93c5fd' }} />
            Recurring Term
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: '#ffe4e6', border: '1px solid #fda4af' }} />
            Suspended HITL
          </span>
        </div>
      </div>

      {/* Timeline Gantt Grid Container */}
      <div style={{ position: 'relative', marginTop: '10px' }}>
        {/* Date Axis Bar */}
        <div style={{ position: 'relative', height: '28px', borderBottom: '1px solid #e2e8f0', marginLeft: '220px', marginBottom: '8px' }}>
          {axisTicks.map((tick, idx) => (
            <div
              key={idx}
              style={{
                position: 'absolute',
                left: `${tick.percent}%`,
                transform: idx === axisTicks.length - 1 ? 'translateX(-100%)' : (idx === 0 ? 'none' : 'translateX(-50%)'),
                fontSize: '10px',
                fontWeight: 600,
                color: '#64748b',
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
                  border: '1px solid #f1f5f9',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  transition: 'background-color 0.15s ease'
                }}
              >
                {/* Lane Label */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>{sub.product_name}</span>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>
                    ${sub.recurring_amount}/mo · {sub.product_tier}
                  </span>
                </div>

                {/* Lane Track */}
                <div style={{ position: 'relative', height: '36px', backgroundColor: '#f8fafc', borderRadius: '6px', overflow: 'visible', border: '1px solid #f1f5f9' }}>
                  {/* Subtle Grid Guideline at 48h */}
                  <div
                    style={{
                      position: 'absolute',
                      left: '0%',
                      width: '100%',
                      height: '100%',
                      background: 'repeating-linear-gradient(90deg, transparent, transparent 19.8%, #f1f5f9 20%)'
                    }}
                  />

                  {/* Active Trial Window Bar */}
                  {isTrial && (
                    <div
                      style={{
                        position: 'absolute',
                        left: '0%',
                        width: `${endPercent}%`,
                        height: '26px',
                        top: '4px',
                        backgroundColor: '#fffbeb',
                        border: '1px solid #fde68a',
                        borderRadius: '5px',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0 10px',
                        fontSize: '11px',
                        fontWeight: 600,
                        color: '#92400e',
                        gap: '6px',
                        overflow: 'hidden'
                      }}
                    >
                      <Clock size={12} color="#d97706" />
                      <span>Trial Active ({daysFromNow.toFixed(0)}d remaining)</span>
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
                        backgroundColor: '#dc2626',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                        boxShadow: '0 2px 5px rgba(220, 38, 38, 0.45)',
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
                            backgroundColor: '#0f172a',
                            color: '#ffffff',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: 400,
                            width: '230px',
                            lineHeight: 1.4,
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            zIndex: 100,
                            pointerEvents: 'none'
                          }}
                        >
                          <div style={{ fontWeight: 600, color: '#fca5a5', marginBottom: '2px' }}>
                            🛡️ 48-Hour Cancellation Guard Armed
                          </div>
                          Scheduled execution 48 hours prior to trial expiration. Prevents recurring conversion without affirmative user consent.
                        </div>
                      )}
                    </div>
                  )}

                  {/* Suspended HITL Lane Bar */}
                  {isSuspended && (
                    <div
                      style={{
                        position: 'absolute',
                        left: '0%',
                        width: '90%',
                        height: '26px',
                        top: '4px',
                        backgroundColor: '#fef2f2',
                        border: '1px solid #fecaca',
                        borderRadius: '5px',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0 10px',
                        fontSize: '11px',
                        fontWeight: 600,
                        color: '#991b1b',
                        gap: '6px'
                      }}
                    >
                      <AlertOctagon size={12} color="#dc2626" />
                      <span>Mandate Suspended: Waiting on Founder Slack Confirmation</span>
                    </div>
                  )}

                  {/* Active Recurring Lane Bar */}
                  {!isTrial && !isSuspended && (
                    <div
                      style={{
                        position: 'absolute',
                        left: '0%',
                        width: `${endPercent}%`,
                        height: '26px',
                        top: '4px',
                        backgroundColor: '#f0f9ff',
                        border: '1px solid #bae6fd',
                        borderRadius: '5px',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0 10px',
                        fontSize: '11px',
                        fontWeight: 500,
                        color: '#0369a1',
                        gap: '6px'
                      }}
                    >
                      <CheckCircle2 size={12} color="#0284c7" />
                      <span>Recurring Term · Renewal on {targetDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
