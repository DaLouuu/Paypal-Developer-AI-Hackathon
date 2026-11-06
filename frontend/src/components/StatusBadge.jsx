import React from 'react';
import { CheckCircle2, Clock, ShieldAlert, ArrowDownCircle, XCircle } from 'lucide-react';

export default function StatusBadge({ status }) {
  const configs = {
    ACTIVE_RECURRING: {
      label: 'ACTIVE',
      dotClass: 'bg-emerald-500',
      bg: '#2edcc4',
      border: '#2edcc4',
      text: '#060723',
      icon: CheckCircle2,
    },
    TRIAL_ACTIVE: {
      label: 'TRIAL ACTIVE',
      dotClass: 'bg-amber-500',
      bg: '#f9dec9',
      border: '#f9dec9',
      text: '#060723',
      icon: Clock,
    },
    SUSPENDED_AWAITING_HUMAN: {
      label: 'SUSPENDED (HITL)',
      dotClass: 'bg-rose-500',
      bg: '#f9dec9',
      border: '#1b1f9d',
      text: '#060723',
      icon: ShieldAlert,
    },
    PENDING_CANCELLATION: {
      label: 'CANCEL PENDING',
      dotClass: 'bg-sky-500',
      bg: '#216e65',
      border: '#216e65',
      text: '#060723',
      icon: ArrowDownCircle,
    },
    CANCELLED: {
      label: 'CANCELLED',
      dotClass: 'bg-slate-400',
      bg: '#1b1f9d',
      border: '#1b1f9d',
      text: '#f9dec9',
      icon: XCircle,
    }
  };

  const config = configs[status] || {
    label: status,
    bg: '#ffffff',
    border: '#1b1f9d',
    text: '#060723',
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

