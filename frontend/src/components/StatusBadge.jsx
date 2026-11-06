import React from 'react';
import { CheckCircle2, Clock, ShieldAlert, ArrowDownCircle, XCircle } from 'lucide-react';

export default function StatusBadge({ status }) {
  const configs = {
    ACTIVE_RECURRING: {
      label: 'ACTIVE',
      dotClass: 'bg-emerald-500',
      bg: '#ecfdf5',
      border: '#a7f3d0',
      text: '#065f46',
      icon: CheckCircle2,
    },
    TRIAL_ACTIVE: {
      label: 'TRIAL ACTIVE',
      dotClass: 'bg-amber-500',
      bg: '#fffbeb',
      border: '#fde68a',
      text: '#92400e',
      icon: Clock,
    },
    SUSPENDED_AWAITING_HUMAN: {
      label: 'SUSPENDED (HITL)',
      dotClass: 'bg-rose-500',
      bg: '#fef2f2',
      border: '#fecaca',
      text: '#991b1b',
      icon: ShieldAlert,
    },
    PENDING_CANCELLATION: {
      label: 'CANCEL PENDING',
      dotClass: 'bg-sky-500',
      bg: '#f0f9ff',
      border: '#bae6fd',
      text: '#0369a1',
      icon: ArrowDownCircle,
    },
    CANCELLED: {
      label: 'CANCELLED',
      dotClass: 'bg-slate-400',
      bg: '#f1f5f9',
      border: '#e2e8f0',
      text: '#475569',
      icon: XCircle,
    }
  };

  const config = configs[status] || {
    label: status,
    bg: '#f8fafc',
    border: '#e2e8f0',
    text: '#64748b',
    icon: Clock
  };

  const Icon = config.icon;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        padding: '3px 9px',
        borderRadius: '6px',
        fontSize: '11px',
        fontWeight: 600,
        letterSpacing: '0.02em',
        backgroundColor: config.bg,
        border: `1px solid ${config.border}`,
        color: config.text,
        whiteSpace: 'nowrap'
      }}
    >
      <Icon size={12} strokeWidth={2.5} />
      <span>{config.label}</span>
    </span>
  );
}
