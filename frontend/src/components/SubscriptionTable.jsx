import React, { useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ShieldAlert, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

export default function SubscriptionTable({ subscriptions, onCancelSubscription, onApproveSuspension }) {
  const totalBurn = useMemo(() => {
    return subscriptions.reduce((sum, item) => sum + (Number(item.recurring_amount) || 0), 0);
  }, [subscriptions]);

  const activeCount = useMemo(() => {
    return subscriptions.filter(item => item.status === 'ACTIVE_RECURRING' || item.status === 'TRIAL_ACTIVE').length;
  }, [subscriptions]);

  const columnDefs = useMemo(() => [
    {
      headerName: 'Vendor & Product',
      field: 'product_name',
      flex: 1.5,
      minWidth: 180,
      cellRenderer: (params) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', height: '100%' }}>
          <span style={{ fontWeight: 600, color: '#0f172a' }}>{params.value}</span>
          <span style={{ fontSize: '11px', color: '#64748b' }}>({params.data.merchant_domain})</span>
        </div>
      )
    },
    {
      headerName: 'Tier',
      field: 'product_tier',
      flex: 1,
      minWidth: 110,
    },
    {
      headerName: 'Seats',
      field: 'active_seats',
      width: 90,
      valueFormatter: (params) => params.value ? `${params.value} seats` : '1 seat'
    },
    {
      headerName: 'Recurring Burn',
      field: 'recurring_amount',
      width: 140,
      valueFormatter: (params) => `$${Number(params.value).toFixed(2)} / mo`
    },
    {
      headerName: 'Cadence',
      field: 'billing_cycle',
      width: 110,
    },
    {
      headerName: 'Renewal / End',
      field: 'next_billing_date',
      width: 130,
      valueFormatter: (params) => params.value ? new Date(params.value).toLocaleDateString() : 'Pending'
    },
    {
      headerName: 'Lifecycle State',
      field: 'status',
      width: 190,
      cellRenderer: (params) => {
        const val = params.value;
        if (val === 'ACTIVE_RECURRING') {
          return (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 8px', borderRadius: '9999px', fontSize: '11px', fontWeight: 600, backgroundColor: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0' }}>
              <CheckCircle size={12} /> ACTIVE
            </span>
          );
        }
        if (val === 'TRIAL_ACTIVE') {
          return (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 8px', borderRadius: '9999px', fontSize: '11px', fontWeight: 600, backgroundColor: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' }}>
              <Clock size={12} /> TRIAL ACTIVE
            </span>
          );
        }
        if (val === 'SUSPENDED_AWAITING_HUMAN') {
          return (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 8px', borderRadius: '9999px', fontSize: '11px', fontWeight: 700, backgroundColor: '#ffe4e6', color: '#9f1239', border: '1px solid #fecdd3' }}>
              <ShieldAlert size={12} /> SUSPENDED (HITL)
            </span>
          );
        }
        return <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '11px', backgroundColor: '#f1f5f9' }}>{val}</span>;
      }
    },
    {
      headerName: 'ToS Risk',
      field: 'tos_risk_score',
      width: 110,
      cellRenderer: (params) => {
        const score = Number(params.value) || 0;
        const color = score > 0.6 ? '#dc2626' : (score > 0.3 ? '#d97706' : '#16a34a');
        return (
          <span style={{ fontWeight: 600, color }}>
            {(score * 100).toFixed(0)}%
          </span>
        );
      }
    },
    {
      headerName: 'Quick Actions',
      field: 'actions',
      width: 150,
      cellRenderer: (params) => {
        const item = params.data;
        if (item.status === 'SUSPENDED_AWAITING_HUMAN') {
          return (
            <button
              onClick={() => onApproveSuspension && onApproveSuspension(item.id)}
              style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', padding: '4px 10px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}
            >
              Approve
            </button>
          );
        }
        return (
          <button
            onClick={() => onCancelSubscription && onCancelSubscription(item.id)}
            style={{ backgroundColor: '#fff', color: '#dc2626', border: '1px solid #fca5a5', borderRadius: '4px', padding: '4px 10px', fontSize: '11px', fontWeight: 500, cursor: 'pointer' }}
          >
            Arm Cancel
          </button>
        );
      }
    }
  ], [onCancelSubscription, onApproveSuspension]);

  return (
    <div data-testid="subscription-table-container" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Metric Header Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Monthly Burn</div>
          <div data-testid="total-burn" style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', marginTop: '4px' }}>
            ${totalBurn.toFixed(2)}
          </div>
        </div>

        <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active Subscriptions</div>
          <div data-testid="active-count" style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', marginTop: '4px' }}>
            {activeCount}
          </div>
        </div>

        <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Trials At Risk (48h)</div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#d97706', marginTop: '4px' }}>
            {subscriptions.filter(i => i.status === 'TRIAL_ACTIVE').length}
          </div>
        </div>
      </div>

      {/* Virtualized AG Grid Table */}
      <div className="ag-theme-alpine" data-testid="subscription-table" style={{ height: '360px', width: '100%' }}>
        <AgGridReact
          rowData={subscriptions}
          columnDefs={columnDefs}
          defaultColDef={{ resizable: true, sortable: true }}
          rowBuffer={20}
          animateRows={true}
        />
      </div>
    </div>
  );
}
