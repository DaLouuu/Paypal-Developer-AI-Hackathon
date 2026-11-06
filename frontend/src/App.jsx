import React, { useState } from 'react';
import BrandLogo from './components/BrandLogo';
import HomeDashboard from './components/HomeDashboard';
import DiscoverySearch from './components/DiscoverySearch';
import SubscriptionTable from './components/SubscriptionTable';
import RenewalTimeline from './components/RenewalTimeline';
import ProductCompareDrawer from './components/ProductCompareDrawer';
import { Home, Compass, CreditCard, Shield, Lock, Bell, ChevronDown, CheckCircle2, Cpu, ExternalLink } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'discover' | 'subscriptions' | 'protection'
  const [subscriptions, setSubscriptions] = useState(INITIAL_SUBSCRIPTIONS);
  const [compareList, setCompareList] = useState([]);

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
    setActiveTab('subscriptions');
  };

  const handleToggleCompare = (tool) => {
    setCompareList(prev => {
      const exists = prev.some(item => item.product_id === tool.product_id);
      if (exists) {
        return prev.filter(item => item.product_id !== tool.product_id);
      }
      if (prev.length >= 3) {
        alert('You can compare up to 3 SaaS products side-by-side.');
        return prev;
      }
      return [...prev, tool];
    });
  };

  const handleRemoveCompare = (productId) => {
    setCompareList(prev => prev.filter(item => item.product_id !== productId));
  };

  const handleClearCompare = () => {
    setCompareList([]);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FAFBFC', color: '#17243D', display: 'flex', flexDirection: 'column' }}>
      {/* Enterprise Customer Header */}
      <header
        style={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #E1E8F0',
          padding: '0 32px',
          height: '66px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          boxShadow: '0 1px 3px rgba(23, 36, 61, 0.03)'
        }}
      >
        {/* Brand Logo & Wordmark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
          <div style={{ cursor: 'pointer' }} onClick={() => setActiveTab('home')}>
            <BrandLogo size={34} showWordmark={true} />
          </div>

          {/* 4 Customer-Facing Destinations */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              type="button"
              className={`nav-pill ${activeTab === 'home' ? 'active' : ''}`}
              onClick={() => setActiveTab('home')}
            >
              <Home size={15} />
              <span>Home</span>
            </button>
            <button
              type="button"
              className={`nav-pill ${activeTab === 'discover' ? 'active' : ''}`}
              onClick={() => setActiveTab('discover')}
            >
              <Compass size={15} />
              <span>Discover</span>
            </button>
            <button
              type="button"
              className={`nav-pill ${activeTab === 'subscriptions' ? 'active' : ''}`}
              onClick={() => setActiveTab('subscriptions')}
            >
              <CreditCard size={15} />
              <span>My Subscriptions</span>
              <span style={{ fontSize: '10px', backgroundColor: activeTab === 'subscriptions' ? '#4568F5' : '#F0F3F8', color: activeTab === 'subscriptions' ? '#ffffff' : '#687F9E', borderRadius: '100px', padding: '1px 6px', fontWeight: 700 }}>
                {subscriptions.length}
              </span>
            </button>
            <button
              type="button"
              className={`nav-pill ${activeTab === 'protection' ? 'active' : ''}`}
              onClick={() => setActiveTab('protection')}
            >
              <Shield size={15} />
              <span>Protection</span>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#22B982' }} />
            </button>
          </nav>
        </div>

        {/* Live Operational Beacon & Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          {/* FastMCP Gateway Beacon */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#293A55', backgroundColor: '#F0F3F8', border: '1px solid #D0D9E7', borderRadius: '8px', padding: '5px 12px' }}>
            <span className="beacon-online" />
            <span style={{ fontWeight: 500 }}>FastMCP Proxy:</span>
            <strong style={{ color: '#188A60', fontWeight: 700 }}>ONLINE (8000)</strong>
          </div>

          {/* AP2 Cryptographic Protocol Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#4C607C' }}>
            <Lock size={13} color="#4568F5" />
            <span>AP2 Ed25519: <strong style={{ color: '#17243D' }}>ENFORCED</strong></span>
          </div>

          <div style={{ width: '1px', height: '24px', backgroundColor: '#E1E8F0' }} />

          {/* User Account / Profile */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#17243D',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 700,
                color: '#ffffff'
              }}
            >
              FA
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#17243D', lineHeight: 1.2 }}>Founder Admin</span>
              <span style={{ fontSize: '10px', color: '#687F9E' }}>PayPal Dev Sandbox</span>
            </div>
            <ChevronDown size={14} color="#687F9E" />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ maxWidth: '1440px', width: '100%', margin: '0 auto', padding: '32px 32px 96px 32px', flex: 1, display: 'flex', flexDirection: 'column', gap: '28px' }}>
        {activeTab === 'home' && (
          <HomeDashboard
            subscriptions={subscriptions}
            onNavigate={setActiveTab}
            onApproveSuspension={handleApprove}
            onCancelSubscription={handleCancel}
          />
        )}

        {activeTab === 'discover' && (
          <DiscoverySearch
            onSelectTool={handleSelectTool}
            compareList={compareList}
            onToggleCompare={handleToggleCompare}
          />
        )}

        {activeTab === 'subscriptions' && (
          <SubscriptionTable
            subscriptions={subscriptions}
            onCancelSubscription={handleCancel}
            onApproveSuspension={handleApprove}
          />
        )}

        {activeTab === 'protection' && (
          <RenewalTimeline subscriptions={subscriptions} />
        )}
      </main>

      {/* Floating Product Comparison Shortlist Drawer */}
      <ProductCompareDrawer
        items={compareList}
        onRemoveItem={handleRemoveCompare}
        onClearAll={handleClearCompare}
        onProvision={handleSelectTool}
      />
    </div>
  );
}
