import React, { useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ShieldAlert, AlertTriangle, CheckCircle2, Clock, DollarSign, Layers, ShieldCheck, ArrowUpRight } from 'lucide-react';
import StatusBadge from './StatusBadge';
import RiskMeter from './RiskMeter';
import ConfirmationModal from './ConfirmationModal';

export default function SubscriptionTable({ subscriptions, onCancelSubscription, onApproveSuspension }) {
  const [modalConfig, setModalConfig] = useState({ isOpen: false });

  // Telemetry KPIs
  const totalBurn = useMemo(() => {
    return subscriptions.reduce((sum, item) => sum + (Number(item.recurring_amount) || 0), 0);
  }, [subscriptions]);

  const activeCount = useMemo(() => {
    return subscriptions.filter(item => item.status === 'ACTIVE_RECURRING' || item.status === 'TRIAL_ACTIVE').length;
  }, [subscriptions]);

  const trialsAtRisk = useMemo(() => {
    return subscriptions.filter(item => item.status === 'TRIAL_ACTIVE' || item.is_trial).length;
  }, [subscriptions]);

  const suspendedCount = useMemo(() => {
    return subscriptions.filter(item => item.status === 'SUSPENDED_AWAITING_HUMAN').length;
  }, [subscriptions]);

  // Confirmation handlers
  const promptCancel = (sub) => {
    setModalConfig({
      isOpen: true,
      title: `Arm Cancellation Guard for ${sub.product_name}?`,
      message: `SubGuard will monitor this subscription and automatically trigger cancellation 48 hours prior to the next billing cycle on ${new Date(sub.next_billing_date).toLocaleDateString()}, preventing unintended conversion charges.`,
      confirmText: 'Arm Cancellation Guard',
      confirmStyle: 'danger',
      onConfirm: () => {
        if (onCancelSubscription) onCancelSubscription(sub.id);
        setModalConfig({ isOpen: false });
      }
    });
  };

  const promptApprove = (sub) => {
    setModalConfig({
      isOpen: true,
      title: `Approve Autonomous Agent Mandate?`,
      message: `This will resume the suspended transaction for ${sub.product_name} ($${Number(sub.recurring_amount).toFixed(2)}) using your Ed25519 principal signature and execute the payment agreement via PayPal MCP.`,
      confirmText: 'Approve & Resume Payment',
      confirmStyle: 'primary',
      onConfirm: () => {
        if (onApproveSuspension) onApproveSuspension(sub.id);
        setModalConfig({ isOpen: false });
      }
    });
  };

  const columnDefs = useMemo(() => [
    {
      headerName: 'Vendor & Product',
      field: 'product_name',
      flex: 1.6,
      minWidth: 200,
      cellRenderer: (params) => {
        const domain = params.data.merchant_domain || '';
        const initial = (params.value || 'V').charAt(0).toUpperCase();
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', height: '100%' }}>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                backgroundColor: '#f1f5f9',
                border: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 700,
                color: '#334155',
                flexShrink: 0
              }}
            >
              {initial}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
              <span style={{ fontWeight: 600, color: '#0f172a', fontSize: '13px' }}>{params.value}</span>
              <span style={{ fontSize: '11px', color: '#64748b' }}>{domain}</span>
            </div>
          </div>
        );
      }
    },
    {
      headerName: 'Tier',
      field: 'product_tier',
      width: 120,
      cellRenderer: (params) => (
        <span style={{ fontSize: '12px', color: '#475569', fontWeight: 500 }}>{params.value}</span>
      )
    },
    {
      headerName: 'Seats',
      field: 'active_seats',
      width: 90,
      cellRenderer: (params) => (
        <span style={{ fontSize: '12px', color: '#475569', fontVariantNumeric: 'tabular-nums' }}>
          {params.value ? `${params.value} seats` : '1 seat'}
        </span>
      )
    },
    {
      headerName: 'Recurring Burn',
      field: 'recurring_amount',
      width: 140,
      cellRenderer: (params) => (
        <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', fontVariantNumeric: 'tabular-nums' }}>
          ${Number(params.value).toFixed(2)} <span style={{ fontSize: '11px', fontWeight: 400, color: '#64748b' }}>/mo</span>
        </span>
      )
    },
    {
      headerName: 'Cadence',
      field: 'billing_cycle',
      width: 110,
      cellRenderer: (params) => (
        <span style={{ fontSize: '11px', fontWeight: 500, color: '#64748b', textTransform: 'capitalize' }}>
          {params.value ? params.value.toLowerCase() : 'monthly'}
        </span>
      )
    },
    {
      headerName: 'Renewal / End',
      field: 'next_billing_date',
      width: 130,
      cellRenderer: (params) => {
        if (!params.value) return <span style={{ fontSize: '11px', color: '#94a3b8' }}>Pending</span>;
        const date = new Date(params.value);
        return (
          <span style={{ fontSize: '12px', color: '#334155', fontVariantNumeric: 'tabular-nums' }}>
            {date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        );
      }
    },
    {
      headerName: 'Lifecycle State',
      field: 'status',
      width: 180,
      cellRenderer: (params) => <StatusBadge status={params.value} />
    },
    {
      headerName: 'ToS Risk',
      field: 'tos_risk_score',
      width: 110,
      cellRenderer: (params) => <RiskMeter score={params.value} size="compact" />
    },
    {
      headerName: 'Actions',
      field: 'actions',
      width: 140,
      pinned: 'right',
      cellRenderer: (params) => {
        const item = params.data;
        if (item.status === 'SUSPENDED_AWAITING_HUMAN') {
          return (
            <button
              type="button"
              onClick={() => promptApprove(item)}
              style={{
                backgroundColor: '#2563eb',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                padding: '4px 10px',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              Approve Mandate
            </button>
          );
        }
        if (item.status === 'PENDING_CANCELLATION') {
          return (
            <span style={{ fontSize: '11px', color: '#0284c7', fontWeight: 600 }}>
              Guard Armed
            </span>
          );
        }
        return (
          <button
            type="button"
            onClick={() => promptCancel(item)}
            style={{
              backgroundColor: '#ffffff',
              color: '#dc2626',
              border: '1px solid #fecaca',
              borderRadius: '6px',
              padding: '4px 10px',
              fontSize: '11px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            Arm Cancel
          </button>
        );
      }
    }
  ], []);

  return (
    <div data-testid="subscription-table-container" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Telemetry KPI Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        {/* KPI 1: Monthly Burn */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Total Monthly Burn
            </span>
            <span style={{ display: 'inline-flex', padding: '6px', borderRadius: '6px', backgroundColor: '#eff6ff', color: '#2563eb' }}>
              <DollarSign size={16} />
            </span>
          </div>
          <div data-testid="total-burn" className="tabular-nums" style={{ fontSize: '26px', fontWeight: 700, color: '#0f172a', marginTop: '8px' }}>
            ${totalBurn.toFixed(2)}
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
            Across all active developer & team seats
          </div>
        </div>

        {/* KPI 2: Active Subscriptions */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Active Licenses
            </span>
            <span style={{ display: 'inline-flex', padding: '6px', borderRadius: '6px', backgroundColor: '#ecfdf5', color: '#10b981' }}>
              <Layers size={16} />
            </span>
          </div>
          <div data-testid="active-count" className="tabular-nums" style={{ fontSize: '26px', fontWeight: 700, color: '#0f172a', marginTop: '8px' }}>
            {activeCount}
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
            Live recurring software contracts
          </div>
        </div>

        {/* KPI 3: Trials Under 48h Guard */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Trials Under 48h Guard
            </span>
            <span style={{ display: 'inline-flex', padding: '6px', borderRadius: '6px', backgroundColor: '#fffbeb', color: '#f59e0b' }}>
              <Clock size={16} />
            </span>
          </div>
          <div className="tabular-nums" style={{ fontSize: '26px', fontWeight: 700, color: trialsAtRisk > 0 ? '#d97706' : '#0f172a', marginTop: '8px' }}>
            {trialsAtRisk}
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
            Automated cancellation scheduled
          </div>
        </div>

        {/* KPI 4: Suspended Agent Requests */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Suspended Agent Requests
            </span>
            <span style={{ display: 'inline-flex', padding: '6px', borderRadius: '6px', backgroundColor: suspendedCount > 0 ? '#fef2f2' : '#f1f5f9', color: suspendedCount > 0 ? '#ef4444' : '#64748b' }}>
              <ShieldAlert size={16} />
            </span>
          </div>
          <div className="tabular-nums" style={{ fontSize: '26px', fontWeight: 700, color: suspendedCount > 0 ? '#dc2626' : '#0f172a', marginTop: '8px' }}>
            {suspendedCount}
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
            {suspendedCount > 0 ? 'Awaiting human authorization' : 'All agent actions governed'}
          </div>
        </div>
      </div>

      {/* Subscription Data Grid Table */}
      <div className="ag-theme-alpine" data-testid="subscription-table" style={{ height: '360px', width: '100%' }}>
        <AgGridReact
          rowData={subscriptions}
          columnDefs={columnDefs}
          defaultColDef={{ resizable: true, sortable: true }}
          rowBuffer={20}
          animateRows={true}
        />
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText={modalConfig.confirmText}
        confirmStyle={modalConfig.confirmStyle}
        onConfirm={modalConfig.onConfirm}
        onCancel={() => setModalConfig({ isOpen: false })}
      />
    </div>
  );
}
