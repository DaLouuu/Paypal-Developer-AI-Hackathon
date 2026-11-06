import React, { useEffect, useMemo, useState } from 'react';
import SubGuardIcon from './components/SubGuardIcon';
import DiscoverySearch from './components/DiscoverySearch';
import SubscriptionTable from './components/SubscriptionTable';
import RenewalTimeline from './components/RenewalTimeline';

const INITIAL_SUBSCRIPTIONS = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    merchant_name: 'Notion',
    merchant_domain: 'notion.so',
    product_name: 'Notion Plus',
    product_tier: 'Team workspace',
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
    product_tier: 'AI code editor',
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
    merchant_name: 'Datadog',
    merchant_domain: 'datadoghq.com',
    product_name: 'Datadog APM',
    product_tier: 'Infrastructure monitoring',
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
  const [shieldOn, setShieldOn] = useState(true);
  const [notice, setNotice] = useState('');
  const [activeNav, setActiveNav] = useState('home');
  const [showTimeline, setShowTimeline] = useState(false);
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('subguard-theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('subguard-theme', theme);
  }, [theme]);

  const totalBurn = useMemo(() => {
    return subscriptions.reduce((sum, item) => sum + (Number(item.recurring_amount) || 0), 0);
  }, [subscriptions]);

  const activeCount = useMemo(() => {
    return subscriptions.filter(item => item.status === 'ACTIVE_RECURRING' || item.status === 'TRIAL_ACTIVE').length;
  }, [subscriptions]);

  const trialsCount = useMemo(() => {
    return subscriptions.filter(item => item.status === 'TRIAL_ACTIVE' || item.is_trial).length;
  }, [subscriptions]);

  const showNotice = (msg) => {
    setNotice(msg);
    setTimeout(() => setNotice(''), 2800);
  };

  const handleCancel = (id) => {
    setSubscriptions(prev =>
      prev.map(sub => sub.id === id ? { ...sub, status: 'PENDING_CANCELLATION' } : sub)
    );
    showNotice('Cancellation guard armed 48h before renewal');
  };

  const handleApprove = (id) => {
    setSubscriptions(prev =>
      prev.map(sub => sub.id === id ? { ...sub, status: 'ACTIVE_RECURRING' } : sub)
    );
    showNotice('Agent spend request approved & resumed via PayPal');
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
    showNotice(`${tool.product_name} added to your active plans!`);
  };

  return (
    <div className="app-shell">
      {/* Toast Notification */}
      {notice && (
        <div className="toast">
          <SubGuardIcon name="check" size={16} />
          {notice}
        </div>
      )}

      {/* Topbar Header */}
      <header className="topbar">
        {/* Brand */}
        <a className="brand" href="#home" aria-label="SubGuard home" onClick={() => setActiveNav('home')}>
          <span className="brand-mark">
            <SubGuardIcon name="bag" size={20} />
            <span className="brand-shield">
              <SubGuardIcon name="shield" size={10} stroke={2.4} />
            </span>
          </span>
          <span className="brand-lockup">
            <span className="brand-name">
              Sub<span>Guard</span>
            </span>
            <small>SHOP SMART. STAY GUARDED.</small>
          </span>
        </a>

        {/* Primary Navigation */}
        <nav aria-label="Primary navigation">
          <a
            className={activeNav === 'home' ? 'active' : ''}
            href="#home"
            onClick={() => setActiveNav('home')}
          >
            <SubGuardIcon name="home" size={16} />
            Home
          </a>
          <a
            className={activeNav === 'discover' ? 'active' : ''}
            href="#discover"
            onClick={() => setActiveNav('discover')}
          >
            <SubGuardIcon name="compass" size={16} />
            Discover
          </a>
          <a
            className={activeNav === 'subscriptions' ? 'active' : ''}
            href="#subscriptions"
            onClick={() => setActiveNav('subscriptions')}
          >
            <SubGuardIcon name="card" size={16} />
            My subscriptions
          </a>
          <a
            className={activeNav === 'protection' ? 'active' : ''}
            href="#protection"
            onClick={() => setActiveNav('protection')}
          >
            <SubGuardIcon name="shield" size={16} />
            Protection <span className="nav-dot" />
          </a>
        </nav>

        {/* Header Actions */}
        <div className="header-actions">
          {/* Theme Switcher */}
          <button
            className="theme-button"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            type="button"
          >
            <SubGuardIcon name={theme === 'light' ? 'moon' : 'sun'} size={17} />
          </button>

          {/* Notifications */}
          <button
            className="notification"
            aria-label="Notifications"
            onClick={() => showNotice('1 trial approaching 48h protection window')}
            type="button"
          >
            <SubGuardIcon name="bell" size={18} />
            <span />
          </button>

          {/* User Profile */}
          <button
            className="profile"
            onClick={() => showNotice('Personal account: Alex Morgan')}
            type="button"
          >
            <span>AM</span>
            <span className="profile-copy">
              <strong>Alex Morgan</strong>
              <small>Personal account</small>
            </span>
            <SubGuardIcon name="chevron" size={14} />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main id="home">
        {/* SECTION 1: Welcome Grid */}
        <section className="welcome-grid">
          <div className="welcome-copy">
            <span className="eyebrow">
              <SubGuardIcon name="shield" size={15} /> Guarded by SubGuard
            </span>

            <h1>
              Good morning, Alex.
              <br />
              Your subscriptions look <em>healthy.</em>
            </h1>

            <p className="intro">
              Shop smarter software, see exactly what you spend, and let SubGuard handle the fine print.
            </p>

            <div className="brand-proof" aria-label="SubGuard benefits">
              <span>
                <SubGuardIcon name="check" size={13} /> Contract checked
              </span>
              <span>
                <SubGuardIcon name="check" size={13} /> Renewal watched
              </span>
              <span>
                <SubGuardIcon name="check" size={13} /> Cancellation ready
              </span>
            </div>

            <div className="hero-actions">
              <a className="primary-button" href="#discover" onClick={() => setActiveNav('discover')}>
                Discover software <SubGuardIcon name="arrow" size={17} />
              </a>
              <a className="text-button" href="#subscriptions" onClick={() => setActiveNav('subscriptions')}>
                Review my subscriptions <SubGuardIcon name="chevron" size={15} />
              </a>
            </div>

            {/* Spend Story Card */}
            <div className="spend-story">
              <div className="spend-main">
                <span>Monthly software spend</span>
                <strong data-testid="total-burn">${totalBurn.toFixed(2)}</strong>
                <small>
                  <span className="positive">
                    <SubGuardIcon name="trend" size={13} /> 8% lower
                  </span>{' '}
                  than last month
                </small>
              </div>

              <div className="mini-chart" aria-label="Spending trend over six months">
                {[55, 68, 49, 72, 62, 44, 51, 36, 42, 29, 34, 25].map((height, index) => (
                  <i key={index} style={{ height }} />
                ))}
              </div>

              <div className="spend-meta">
                <div>
                  <strong data-testid="active-count">{activeCount}</strong>
                  <span>Active plans</span>
                </div>
                <div>
                  <strong>{trialsCount}</strong>
                  <span>Protected trial</span>
                </div>
              </div>
            </div>
          </div>

          {/* Autopilot Cancellation Shield Panel */}
          <aside className={`shield-panel ${shieldOn ? '' : 'shield-off'}`} id="protection">
            <div className="shield-heading">
              <div>
                <span className="live-label">
                  <i /> SUBGUARD AUTOPILOT
                </span>
                <h2>Cancellation Shield</h2>
              </div>
              <button
                className={`toggle ${shieldOn ? 'on' : ''}`}
                aria-pressed={shieldOn}
                onClick={() => setShieldOn(!shieldOn)}
                type="button"
              >
                <span />
              </button>
            </div>

            <div className="shield-visual">
              <div className="orbit orbit-one" />
              <div className="orbit orbit-two" />
              <div className="shield-core">
                <SubGuardIcon name="shield" size={38} stroke={1.45} />
              </div>
              <span className="orbit-dot dot-one" />
              <span className="orbit-dot dot-two" />
            </div>

            <div className="shield-status">
              <span>CURSOR PRO TRIAL</span>
              <strong>{shieldOn ? '2 days, 14 hours' : 'Protection paused'}</strong>
              <p>
                {shieldOn
                  ? 'Until SubGuard steps in before renewal'
                  : 'Turn protection back on to avoid an unwanted renewal.'}
              </p>
            </div>

            <div className="next-step">
              <span className="step-icon">
                <SubGuardIcon name="wand" size={17} />
              </span>
              <div>
                <small>WHAT HAPPENS NEXT</small>
                <p>
                  {shieldOn
                    ? 'We’ll check in 48 hours before billing. No reply? We cancel it for you.'
                    : 'Automated cancellation is currently disabled.'}
                </p>
              </div>
            </div>

            <button
              className="shield-link"
              onClick={() => {
                setShowTimeline(!showTimeline);
                showNotice(showTimeline ? 'Protection timeline closed' : 'Protection timeline expanded');
              }}
              type="button"
            >
              {showTimeline ? 'Hide protection timeline' : 'View protection timeline'} <SubGuardIcon name="arrow" size={16} />
            </button>
          </aside>
        </section>

        {/* Optional Collapsible Protection Gantt Timeline */}
        {showTimeline && (
          <div style={{ margin: '24px 0' }}>
            <RenewalTimeline subscriptions={subscriptions} />
          </div>
        )}

        {/* SECTION 2: Upcoming Renewal Ribbon */}
        <section className="renewal-ribbon">
          <span className="renewal-icon">
            <SubGuardIcon name="calendar" size={20} />
          </span>
          <div>
            <small>UPCOMING RENEWAL</small>
            <p>
              <strong>Notion Plus</strong> renews in 12 days for $80.00
            </p>
          </div>
          <span className="date-pill">NOV 18</span>
          <button
            onClick={() => showNotice('Notion Plus renewal verified under active $50 spending policy')}
            type="button"
          >
            Review renewal <SubGuardIcon name="arrow" size={16} />
          </button>
        </section>

        {/* SECTION 3: The SubGuard Edit SaaS Marketplace */}
        <DiscoverySearch onSelectTool={handleSelectTool} />

        {/* SECTION 4: Subscriptions Management */}
        <section className="subscriptions-section" id="subscriptions">
          <SubscriptionTable
            subscriptions={subscriptions}
            onCancelSubscription={handleCancel}
            onApproveSuspension={handleApprove}
          />
        </section>

        {/* SECTION 5: The SubGuard Promise */}
        <section className="promise">
          <div className="promise-mark">
            <SubGuardIcon name="bag" size={32} />
            <SubGuardIcon name="shield" size={18} />
          </div>
          <div>
            <span>THE SUBGUARD PROMISE</span>
            <h2>Great software should never come with a catch.</h2>
            <p>
              We read the terms, watch the dates, and protect every purchase—so you can focus on choosing tools you love.
            </p>
          </div>
          <a href="#protection" onClick={() => setActiveNav('protection')}>
            How protection works <SubGuardIcon name="arrow" size={17} />
          </a>
        </section>
      </main>

      {/* Footer */}
      <footer>
        <a className="brand footer-brand" href="#home" onClick={() => setActiveNav('home')}>
          <span className="brand-mark">
            <SubGuardIcon name="bag" size={18} />
          </span>
          <span className="brand-name">SubGuard</span>
        </a>
        <p>Your software. Your money. Protected.</p>
        <span>© 2026 SubGuard</span>
      </footer>
    </div>
  );
}
