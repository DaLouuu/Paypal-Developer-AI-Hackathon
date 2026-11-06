import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle } from 'lucide-react';

export default function RiskMeter({ score = 0, size = 'default' }) {
  const normalized = Math.min(1, Math.max(0, Number(score) || 0));
  const percent = Math.round(normalized * 100);

  let category = 'Low Risk';
  let color = '#10b981';
  let bgColor = '#ecfdf5';
  let borderColor = '#a7f3d0';
  let Icon = ShieldCheck;

  if (normalized > 0.6) {
    category = 'High Risk';
    color = '#ef4444';
    bgColor = '#fef2f2';
    borderColor = '#fecaca';
    Icon = ShieldAlert;
  } else if (normalized > 0.3) {
    category = 'Moderate';
    color = '#f59e0b';
    bgColor = '#fffbeb';
    borderColor = '#fde68a';
    Icon = AlertTriangle;
  }

  // Segment fill states
  const seg1Active = true;
  const seg2Active = normalized > 0.3;
  const seg3Active = normalized > 0.6;

  if (size === 'compact') {
    return (
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
        <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: seg1Active ? (seg2Active ? (seg3Active ? '#ef4444' : '#f59e0b') : '#10b981') : '#e2e8f0' }} />
          <span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: seg2Active ? (seg3Active ? '#ef4444' : '#f59e0b') : '#e2e8f0' }} />
          <span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: seg3Active ? '#ef4444' : '#e2e8f0' }} />
        </div>
        <span style={{ fontSize: '11px', fontWeight: 600, color, fontVariantNumeric: 'tabular-nums' }}>
          {percent}%
        </span>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 600, color }}>
          <Icon size={12} strokeWidth={2.5} />
          {category}
        </span>
        <span style={{ fontWeight: 700, color, fontVariantNumeric: 'tabular-nums' }}>
          {percent}%
        </span>
      </div>

      {/* Segmented bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '3px', height: '4px', borderRadius: '2px', overflow: 'hidden' }}>
        <div style={{ backgroundColor: seg1Active ? (seg2Active ? (seg3Active ? '#ef4444' : '#f59e0b') : '#10b981') : '#e2e8f0', borderRadius: '1px' }} />
        <div style={{ backgroundColor: seg2Active ? (seg3Active ? '#ef4444' : '#f59e0b') : '#e2e8f0', borderRadius: '1px' }} />
        <div style={{ backgroundColor: seg3Active ? '#ef4444' : '#e2e8f0', borderRadius: '1px' }} />
      </div>
    </div>
  );
}
