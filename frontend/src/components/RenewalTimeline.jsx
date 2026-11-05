import React, { useState } from 'react';
import { Calendar, Shield, Clock, AlertOctagon } from 'lucide-react';

export default function RenewalTimeline({ subscriptions }) {
  const [selectedHorizon, setSelectedHorizon] = useState('30d');

  return (
    <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Calendar size={18} color="#2563eb" />
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#0f172a' }}>
            Multi-Horizon Contract Lifecycle & Cancellation Guard Timeline
          </h3>
        </div>

        {/* Horizon Filter Tabs */}
        <div style={{ display: 'flex', gap: '6px', backgroundColor: '#f1f5f9', padding: '4px', borderRadius: '6px' }}>
          {['30d', '60d', '90d', 'Annual'].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedHorizon(tab)}
              style={{
                border: 'none',
                padding: '4px 10px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: selectedHorizon === tab ? 600 : 400,
                backgroundColor: selectedHorizon === tab ? '#ffffff' : 'transparent',
                color: selectedHorizon === tab ? '#0f172a' : '#64748b',
                cursor: 'pointer',
                boxShadow: selectedHorizon === tab ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
              }}
            >
              {tab} Horizon
            </button>
          ))}
        </div>
      </div>

      {/* Visual Timeline Lanes */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
        {subscriptions.map((sub) => {
          const isTrial = sub.status === 'TRIAL_ACTIVE' || sub.is_trial;
          const isSuspended = sub.status === 'SUSPENDED_AWAITING_HUMAN';

          return (
            <div
              key={sub.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '220px 1fr',
                alignItems: 'center',
                gap: '16px',
                padding: '12px',
                borderRadius: '6px',
                backgroundColor: '#f8fafc',
                border: '1px solid #edf2f7'
              }}
            >
              <div>
                <div style={{ fontWeight: 600, fontSize: '13px', color: '#1e293b' }}>{sub.product_name}</div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>${sub.recurring_amount}/mo · {sub.product_tier}</div>
              </div>

              {/* Timeline Track */}
              <div style={{ position: 'relative', height: '36px', backgroundColor: '#e2e8f0', borderRadius: '6px', display: 'flex', alignItems: 'center', padding: '0 8px' }}>
                {isTrial && (
                  <div
                    style={{
                      position: 'absolute',
                      left: '5%',
                      width: '45%',
                      height: '24px',
                      backgroundColor: '#fde68a',
                      border: '1px solid #f59e0b',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0 8px',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: '#92400e',
                      gap: '4px'
                    }}
                  >
                    <Clock size={12} /> Active Trial Window
                  </div>
                )}

                {isTrial && (
                  <div
                    title="Auto-Cancellation Guard: Trigger scheduled 48h prior to conversion"
                    style={{
                      position: 'absolute',
                      left: '48%',
                      width: '26px',
                      height: '26px',
                      backgroundColor: '#dc2626',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      boxShadow: '0 2px 4px rgba(220,38,38,0.4)',
                      cursor: 'pointer'
                    }}
                  >
                    <Shield size={14} />
                  </div>
                )}

                {isSuspended && (
                  <div
                    style={{
                      position: 'absolute',
                      left: '10%',
                      width: '80%',
                      height: '24px',
                      backgroundColor: '#ffe4e6',
                      border: '1px solid #f43f5e',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#be123c',
                      gap: '6px'
                    }}
                  >
                    <AlertOctagon size={13} /> Mandate Suspended: Waiting on Founder Slack Confirmation
                  </div>
                )}

                {!isTrial && !isSuspended && (
                  <div
                    style={{
                      position: 'absolute',
                      left: '20%',
                      width: '60%',
                      height: '24px',
                      backgroundColor: '#e0f2fe',
                      border: '1px solid #38bdf8',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0 8px',
                      fontSize: '11px',
                      color: '#0369a1'
                    }}
                  >
                    Active Recurring Term · Next Billing {new Date(sub.next_billing_date).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
