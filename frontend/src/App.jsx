import React, { useState } from 'react';
import SubscriptionTable from './components/SubscriptionTable';
import RenewalTimeline from './components/RenewalTimeline';
import DiscoverySearch from './components/DiscoverySearch';
import { Shield, Lock, Bell, ChevronDown, CheckCircle2, Cpu, ExternalLink } from 'lucide-react';

const INITIAL_SUBSCRIPTIONS = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    merchant_name: 'Notion',
    merchant_domain: 'notion.so',
    product_name: 'Notion Team Plus',
    product_tier: 'Team Plus',
    active_seats: 8,
    recurring_amount: 80.0,
    currency: 'USD',
    billing_cycle: 'MONTHLY',
    status: 'ACTIVE_RECURRING',
    is_trial: false,
    next_billing_date: '2026-11-18T00:00:00Z',
    tos_risk_score: 0.12
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    merchant_name: 'Cursor',
    merchant_domain: 'cursor.sh',
    product_name: 'Cursor Pro',
    product_tier: 'Pro',
    active_seats: 4,
    recurring_amount: 80.0,
    currency: 'USD',
    billing_cycle: 'MONTHLY',
    status: 'TRIAL_ACTIVE',
    is_trial: true,
    trial_end_date: '2026-11-10T00:00:00Z',
    next_billing_date: '2026-11-10T00:00:00Z',
    tos_risk_score: 0.82
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    merchant_name: 'DataDog',
    merchant_domain: 'datadoghq.com',
    product_name: 'DataDog APM',
    product_tier: 'Pro Infra',
    active_seats: 2,
    recurring_amount: 75.0,
    currency: 'USD',
    billing_cycle: 'MONTHLY',
    status: 'SUSPENDED_AWAITING_HUMAN',
    is_trial: false,
    next_billing_date: '2026-11-26T00:00:00Z',
    tos_risk_score: 0.45
  }
];

export default function App() {
  const [subscriptions, setSubscriptions] = useState(INITIAL_SUBSCRIPTIONS);

  const handleCancel = (id) => {
    setSubscriptions(prev =>
      prev.map(sub => sub.id === id ? { ...sub, status: 'PENDING_CANCELLATION' } : sub)
    );
  };

  const handleApprove = (id) => {
    setSubscriptions(prev =>
      prev.map(sub => sub.id === id ? { ...sub, status: 'ACTIVE_RECURRING' } : sub)
    );
  };

  const handleSelectTool = (tool) => {
    const newSub = {
      id: `sub_${Date.now()}`,
      merchant_name: tool.product_name,
      merchant_domain: tool.vendor_domain,
      product_name: tool.product_name,
      product_tier: tool.pricing_tier,
      active_seats: 1,
      recurring_amount: tool.monthly_cost,
      currency: 'USD',
      billing_cycle: 'MONTHLY',
      status: 'ACTIVE_RECURRING',
      is_trial: false,
      next_billing_date: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(),
      tos_risk_score: tool.tos_risk_score
    };
    setSubscriptions(prev => [newSub, ...prev]);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', color: '#0f172a' }}>
      {/* Enterprise Application Header */}
      <header
        style={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          padding: '0 32px',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}
      >
        {/* Brand & Wordmark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: '#0f172a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}
          >
            <Shield size={18} strokeWidth={2.5} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.02em' }}>
                SubGuard AI
              </span>
              <span style={{ fontSize: '10px', fontWeight: 600, color: '#2563eb', backgroundColor: '#eff6ff', border: '1px solid #dbeafe', borderRadius: '4px', padding: '1px 5px' }}>
                v1.0
              </span>
            </div>
            <div style={{ fontSize: '11px', color: '#64748b', lineHeight: 1 }}>
              Autonomous Subscription Governance & Protocol Proxy
            </div>
          </div>
        </div>

        {/* Live Operational Status Indicators */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {/* FastMCP Gateway Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '12px', color: '#334155', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '5px 10px' }}>
            <span className="beacon-online" />
            <span style={{ fontWeight: 500 }}>FastMCP Proxy:</span>
            <strong style={{ color: '#059669', fontWeight: 600 }}>ONLINE (port 8000)</strong>
          </div>

          {/* AP2 Cryptographic Verifier */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#475569' }}>
            <Lock size={13} color="#2563eb" />
            <span>AP2 Ed25519: <strong style={{ color: '#0f172a' }}>ENFORCED</strong></span>
          </div>

          <div style={{ width: '1px', height: '24px', backgroundColor: '#e2e8f0' }} />

          {/* User Profile Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: '#e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: 700,
                color: '#334155'
              }}
            >
              FA
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#0f172a' }}>Founder Admin</span>
              <span style={{ fontSize: '10px', color: '#64748b' }}>PayPal Dev Sandbox</span>
            </div>
            <ChevronDown size={14} color="#94a3b8" />
          </div>
        </div>
      </header>

      {/* Main Container - Full-Width Balanced Layout */}
      <main style={{ maxWidth: '1440px', margin: '0 auto', padding: '32px 32px 64px 32px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
        {/* Hero Operational Banner */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.02em' }}>
              Subscription Governance & Discovery Console
            </h1>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' }}>
              Continuous SaaS vendor discovery, contractual ToS dark-pattern risk scoring, and autonomous trial auto-cancellation.
            </p>
          </div>

          {/* Architecture Journey Pills: Discover -> Evaluate -> Govern -> Protect */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 600 }}>
            <span style={{ color: '#2563eb', backgroundColor: '#eff6ff', padding: '3px 8px', borderRadius: '4px' }}>1. Discover</span>
            <span style={{ color: '#cbd5e1' }}>→</span>
            <span style={{ color: '#2563eb', backgroundColor: '#eff6ff', padding: '3px 8px', borderRadius: '4px' }}>2. Evaluate</span>
            <span style={{ color: '#cbd5e1' }}>→</span>
            <span style={{ color: '#059669', backgroundColor: '#ecfdf5', padding: '3px 8px', borderRadius: '4px' }}>3. Govern</span>
            <span style={{ color: '#cbd5e1' }}>→</span>
            <span style={{ color: '#dc2626', backgroundColor: '#fef2f2', padding: '3px 8px', borderRadius: '4px' }}>4. Protect (48h Shield)</span>
          </div>
        </div>

        {/* SECTION 1: Semantic SaaS Discovery & ToS Risk Radar */}
        <section>
          <DiscoverySearch onSelectTool={handleSelectTool} />
        </section>

        {/* SECTION 2: Active Financial Telemetry & Subscription Grid (AG Grid) */}
        <section>
          <div style={{ marginBottom: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>
                Active Subscription Telemetry & Seat Allocation
              </h2>
              <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748b' }}>
                Dense financial grid with real-time seat tracking, AP2 cryptographic status, and one-click cancellation guards.
              </p>
            </div>
          </div>
          <SubscriptionTable
            subscriptions={subscriptions}
            onCancelSubscription={handleCancel}
            onApproveSuspension={handleApprove}
          />
        </section>

        {/* SECTION 3: Contract Lifecycle & Cancellation Timeline (Bryntum Gantt Concept) */}
        <section>
          <RenewalTimeline subscriptions={subscriptions} />
        </section>
      </main>
    </div>
  );
}
