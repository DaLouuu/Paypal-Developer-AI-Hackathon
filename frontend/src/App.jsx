import React, { useEffect, useMemo, useState } from 'react';
import SubGuardIcon from './components/SubGuardIcon';
import DiscoverySearch from './components/DiscoverySearch';
import SubscriptionTable from './components/SubscriptionTable';
import RenewalTimeline from './components/RenewalTimeline';
import NotificationsDrawer from './components/NotificationsDrawer';
import AccountModal from './components/AccountModal';
import LoadingScreen from './components/LoadingScreen';

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
  const [spendingCap, setSpendingCap] = useState(50);
  const [notice, setNotice] = useState('');
  const [activeNav, setActiveNav] = useState('home');
  const [showTimeline, setShowTimeline] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('subguard-user');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {
      fullName: 'Alex Morgan',
      firstName: 'Alex',
      role: 'Admin',
      initials: 'AM',
      organization: 'PayPal Dev Sandbox Organization'
    };
  });

  const handleUpdateUser = (updated) => {
    setUser(prev => {
      const next = { ...prev, ...updated };
      if (updated.fullName) {
        const parts = updated.fullName.trim().split(/\s+/);
        next.firstName = parts[0] || 'Alex';
        next.initials = (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase();
      }
      try {
        localStorage.setItem('subguard-user', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Good morning';
    if (hour >= 12 && hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const [greeting, setGreeting] = useState(getTimeGreeting);

  useEffect(() => {
    setGreeting(getTimeGreeting());
    const timer = setInterval(() => {
      setGreeting(getTimeGreeting());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

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

  const subscriptionHealth = useMemo(() => {
    const suspended = subscriptions.filter(s => s.status === 'SUSPENDED_AWAITING_HUMAN');
    const trials = subscriptions.filter(s => s.status === 'TRIAL_ACTIVE' || s.is_trial);

    // If Autopilot shield has been toggled off by user
    if (!shieldOn) {
      return {
        prefix: 'Autopilot protection is ',
        highlight: 'paused.',
        statusType: 'paused',
        badgeIcon: 'shield',
        badgeTone: 'paused',
        badgeText: 'AUTOPILOT PAUSED · CLICK TO RESUME',
        badgeActionTooltip: 'Click to resume automated cancellation safeguard',
        description: 'Automated 48-hour cancellation guards and policy monitors are temporarily halted.'
      };
    }

    // Case 1: Suspended subscriptions needing human approval
    if (suspended.length > 0) {
      const sName = suspended[0].product_name || '1 subscription';
      return {
        prefix: suspended.length === 1 ? '1 subscription needs ' : `${suspended.length} subscriptions need `,
        highlight: 'attention.',
        statusType: 'attention',
        badgeIcon: 'alert',
        badgeTone: 'alert',
        badgeText: suspended.length === 1
          ? `1 ACTION REQUIRED · ${sName.toUpperCase()} HELD`
          : `${suspended.length} ACTIONS REQUIRED · HELD AT CEILING`,
        badgeActionTooltip: 'Click to inspect and authorize suspended subscription',
        description: `${sName} triggered policy limits and is awaiting your founder authorization.`
      };
    }

    // Case 2: Spending near or reaching monthly cap
    if (spendingCap > 0 && totalBurn >= spendingCap) {
      return {
        prefix: 'Your spending reached the ',
        highlight: 'limit.',
        statusType: 'warning',
        badgeIcon: 'shield',
        badgeTone: 'warning',
        badgeText: `CEILING REACHED · $${totalBurn.toFixed(0)} / $${spendingCap.toFixed(0)} CAP`,
        badgeActionTooltip: 'Click to adjust transaction ceiling in Passport',
        description: `Total monthly burn ($${totalBurn.toFixed(2)}) is at your $${spendingCap.toFixed(2)} transaction limit.`
      };
    }

    // Case 3: Protected trials active
    if (trials.length > 0) {
      return {
        prefix: 'Your subscriptions are ',
        highlight: 'protected.',
        statusType: 'protected',
        badgeIcon: 'shield',
        badgeTone: 'active',
        badgeText: `AUTOPILOT ARMED · ${trials.length} TRIAL${trials.length > 1 ? 'S' : ''} SECURED`,
        badgeActionTooltip: 'Click to view 48-hour cancellation countdown schedule',
        description: `All software contracts are monitored, with ${trials.length} trial armed for auto-cancellation.`
      };
    }

    // Case 4: No active subscriptions
    if (subscriptions.length === 0) {
      return {
        prefix: 'Your subscription ledger is ',
        highlight: 'clear.',
        statusType: 'clear',
        badgeIcon: 'shield',
        badgeTone: 'active',
        badgeText: 'AUTOPILOT READY · 0 ACTIVE CHARGES',
        badgeActionTooltip: 'Click to discover pre-vetted tools in catalog',
        description: 'No recurring charges active. Discover contract-checked software in the catalog.'
      };
    }

    // Case 5: All healthy
    return {
      prefix: 'Your subscriptions look ',
      highlight: 'healthy.',
      statusType: 'healthy',
      badgeIcon: 'shield',
      badgeTone: 'active',
      badgeText: `AUTOPILOT ACTIVE · ${activeCount} CONTRACTS VERIFIED`,
      badgeActionTooltip: 'Click to inspect AP2 verification and protection center',
      description: 'Shop smarter software, see exactly what you spend, and let SubGuard handle the fine print.'
    };
  }, [subscriptions, spendingCap, totalBurn, shieldOn, activeCount]);

  const showNotice = (msg) => {
    setNotice(msg);
    setTimeout(() => setNotice(''), 3000);
  };

  const navigateTo = (pageId) => {
    setActiveNav(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = (id) => {
    setSubscriptions(prev =>
      prev.map(sub => sub.id === id ? { ...sub, status: 'PENDING_CANCELLATION' } : sub)
    );
    showNotice('Cancellation guard armed: scheduled 48h before renewal');
  };

  const handleApprove = (id) => {
    setSubscriptions(prev =>
      prev.map(sub => sub.id === id ? { ...sub, status: 'ACTIVE_RECURRING' } : sub)
    );
    showNotice('Agent spend request approved & resumed via PayPal MCP');
  };

  const handleApproveDatadog = () => {
    const datadogSub = subscriptions.find(s => s.status === 'SUSPENDED_AWAITING_HUMAN');
    if (datadogSub) {
      handleApprove(datadogSub.id);
    }
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
    showNotice(`${tool.product_name} provisioned under SubGuard protection!`);
    navigateTo('subscriptions');
  };

  const handleUpdateSpendingCap = (newCap) => {
    setSpendingCap(newCap);
    showNotice(`Autonomous ceiling updated to $${newCap.toFixed(2)}/mo`);
  };

  return (
    <div className="app-shell" style={{ paddingBottom: '90px' }}>
      {/* Loading Screen Overlay */}
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}

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
        <a
          className="brand"
          href="#home"
          aria-label="SubGuard home"
          onClick={(e) => {
            e.preventDefault();
            navigateTo('home');
          }}
        >
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
            onClick={(e) => {
              e.preventDefault();
              navigateTo('home');
            }}
          >
            <SubGuardIcon name="home" size={16} />
            Dashboard
          </a>
          <a
            className={activeNav === 'discover' ? 'active' : ''}
            href="#discover"
            onClick={(e) => {
              e.preventDefault();
              navigateTo('discover');
            }}
          >
            <SubGuardIcon name="compass" size={16} />
            Catalog
          </a>
          <a
            className={activeNav === 'subscriptions' ? 'active' : ''}
            href="#subscriptions"
            onClick={(e) => {
              e.preventDefault();
              navigateTo('subscriptions');
            }}
          >
            <SubGuardIcon name="card" size={16} />
            Subscriptions
          </a>
          <a
            className={activeNav === 'protection' ? 'active' : ''}
            href="#protection"
            onClick={(e) => {
              e.preventDefault();
              navigateTo('protection');
            }}
          >
            <SubGuardIcon name="shield" size={16} />
            Protection <span className="nav-dot" />
          </a>
        </nav>

        {/* Header Actions */}
        <div className="header-actions">
          {/* FastMCP Live Beacon */}
          <button
            type="button"
            className="fastmcp-badge outline-button"
            onClick={() => setIsLoading(true)}
            title="FastMCP Gateway Online · Click to re-verify handshake"
          >
            <span className="fastmcp-badge-dot" />
            <span className="fastmcp-badge-text">FastMCP:8000</span>
          </button>

          {/* Theme Switcher */}
          <button
            className="theme-button"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            type="button"
          >
            <SubGuardIcon name={theme === 'light' ? 'moon' : 'sun'} size={17} />
          </button>

          {/* Notifications Bell */}
          <button
            className="notification"
            aria-label="Notifications"
            onClick={() => setIsNotificationsOpen(true)}
            type="button"
          >
            <SubGuardIcon name="bell" size={18} />
            <span />
          </button>

          {/* User Profile / Governance Passport */}
          <button
            className="profile"
            onClick={() => setIsAccountOpen(true)}
            aria-label="Open Governance & Security Passport"
            type="button"
          >
            <span className="profile-avatar">{user.initials || 'AM'}</span>
            <span className="profile-copy">
              <strong>{user.fullName || 'Alex Morgan'}</strong>
              <small>{user.role || 'Admin'} · Passport</small>
            </span>
            <SubGuardIcon name="chevron" size={14} />
          </button>
        </div>
      </header>

      {/* Main Multi-Page Routed Views */}
      <main>
        {activeNav === 'discover' && (
          <div className="page-container" id="discover">
            <DiscoverySearch onSelectTool={handleSelectTool} />
          </div>
        )}

        {activeNav === 'subscriptions' && (
          <div className="page-container" id="subscriptions">
            <section className="subscriptions-section">
              <SubscriptionTable
                subscriptions={subscriptions}
                onCancelSubscription={handleCancel}
                onApproveSuspension={handleApprove}
                onNavigate={navigateTo}
              />
            </section>
          </div>
        )}

        {activeNav === 'protection' && (
          <div className="page-container" id="protection">
            <div className="protection-grid">
              {/* Row 1, Col 1: Autopilot Cancellation Shield Panel */}
              <aside className={`shield-panel ${shieldOn ? '' : 'shield-off'}`}>
                <div className="card-top-header">
                  <div>
                    <span className="live-label">
                      <i /> {shieldOn ? 'SUBGUARD AUTOPILOT' : 'AUTOPILOT PAUSED'}
                    </span>
                    <h3 style={{ margin: '4px 0 0', fontSize: '17px', fontWeight: 700, color: 'var(--navy)' }}>
                      Cancellation Shield
                    </h3>
                  </div>
                  <button
                    className={`toggle ${shieldOn ? 'on' : ''}`}
                    aria-pressed={shieldOn}
                    onClick={() => {
                      setShieldOn(!shieldOn);
                      showNotice(shieldOn ? 'Autopilot protection paused' : 'Autopilot protection resumed');
                    }}
                    type="button"
                  >
                    <span />
                  </button>
                </div>

                <div className={`shield-visual ${shieldOn ? '' : 'is-paused'}`} style={{ margin: '10px 0' }}>
                  <div className="orbit orbit-one" />
                  <div className="orbit orbit-two" />
                  <div className="shield-core">
                    <SubGuardIcon name={shieldOn ? "shield" : "shield-pause"} size={26} stroke={2.2} />
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

                <div className="next-step" style={{ marginTop: '16px' }}>
                  <span className="step-icon">
                    <SubGuardIcon name={shieldOn ? "wand" : "alert"} size={17} />
                  </span>
                  <div>
                    <small>{shieldOn ? 'WHAT HAPPENS NEXT' : 'PROTECTION HALTED'}</small>
                    <p>
                      {shieldOn
                        ? 'We’ll check in 48 hours before billing. No reply? We cancel it for you.'
                        : 'Automated cancellation is currently disabled.'}
                    </p>
                  </div>
                </div>
              </aside>

              {/* Row 1, Col 2: Cryptographic Key & Protocol Binding */}
              <div className="governance-card">
                <div className="card-top-header">
                  <div>
                    <span className="live-label">
                      <i /> PROTOCOL VERIFIER
                    </span>
                    <h3 style={{ margin: '4px 0 0', fontSize: '17px', fontWeight: 700, color: 'var(--navy)' }}>
                      Cryptographic Protocol Binding
                    </h3>
                  </div>
                  <span className="badge-verified" style={{ padding: '3px 8px', fontSize: '10px' }}>
                    <SubGuardIcon name="lock" size={11} stroke={2.2} /> Ed25519 Active
                  </span>
                </div>

                <div className="protocol-spec-list" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', margin: '14px 0' }}>
                  <div className="protocol-spec-item">
                    <span>AP2 Protocol Verifier</span>
                    <strong style={{ color: 'var(--green, #216e65)' }}>Ed25519 ENFORCED</strong>
                  </div>
                  <div className="protocol-spec-item">
                    <span>Key Fingerprint</span>
                    <strong>ed25519:e4a7...99b2</strong>
                  </div>
                  <div className="protocol-spec-item">
                    <span>FastMCP Proxy Gateway</span>
                    <strong>http://localhost:8000</strong>
                  </div>
                  <div className="protocol-spec-item">
                    <span>Handshake Latency</span>
                    <strong style={{ color: 'var(--green, #216e65)' }}>0.42 ms (SLO &lt; 50ms)</strong>
                  </div>
                </div>

                <div className="next-step" style={{ marginTop: '16px' }}>
                  <span className="step-icon">
                    <SubGuardIcon name="shield" size={17} />
                  </span>
                  <div>
                    <small>GATEWAY AUDIT STATUS</small>
                    <p>Deterministic mandates validated by FastMCP daemon on Port 8000.</p>
                  </div>
                </div>
              </div>

              {/* Row 2, Col 1: Autonomous Spending Policy Card */}
              <div className="governance-card">
                <div className="card-top-header" style={{ marginBottom: '14px' }}>
                  <div>
                    <span className="live-label">
                      <i /> GOVERNANCE CONTROLS
                    </span>
                    <h3 style={{ margin: '4px 0 0', fontSize: '17px', fontWeight: 700, color: 'var(--navy)' }}>
                      Autonomous Spending Policy
                    </h3>
                  </div>
                  <span className="badge-verified" style={{ padding: '3px 8px', fontSize: '10px', background: 'var(--blue)', color: '#ffffff' }}>
                    Deterministic
                  </span>
                </div>

                <div className="governance-metric-row" style={{ margin: 'auto 0 16px' }}>
                  <div className="governance-metric-box">
                    <span>Single Transaction Ceiling</span>
                    <strong>${spendingCap.toFixed(2)}</strong>
                    <small>Transactions above require HITL</small>
                  </div>
                  <div className="governance-metric-box">
                    <span>Monthly Hard Cap</span>
                    <strong>$500.00</strong>
                    <small>Hard deterministic rejection</small>
                  </div>
                </div>

                <button
                  type="button"
                  className="outline-button"
                  onClick={() => setIsAccountOpen(true)}
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  Configure Policy Ceilings in Passport
                </button>
              </div>

              {/* Row 2, Col 2: Pending Human Approval Card */}
              <div className="governance-card">
                <div className="card-top-header" style={{ marginBottom: '14px' }}>
                  <div>
                    <span className="live-label" style={{ color: '#e05260' }}>
                      <i style={{ background: '#e05260', boxShadow: '0 0 0 4px rgba(224, 82, 96, 0.15)' }} /> HUMAN-IN-THE-LOOP
                    </span>
                    <h3 style={{ margin: '4px 0 0', fontSize: '17px', fontWeight: 700, color: 'var(--navy)' }}>
                      Awaiting Human Approval
                    </h3>
                  </div>
                  <span className="notice-tag tag-crimson" style={{ margin: 0 }}>
                    1 Pending
                  </span>
                </div>

                <div className="notice-card notice-card-crimson" style={{ margin: 'auto 0 16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="notice-tag tag-crimson">Limit Exceeded</span>
                    <span className="notice-time">Action Needed</span>
                  </div>
                  <strong className="notice-title">Datadog APM ($75.00/mo)</strong>
                  <p className="notice-body">
                    Autonomous agent spend exceeds $50.00 ceiling. Requires founder sign-off to proceed.
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <button
                    type="button"
                    className="approve-button"
                    onClick={() => {
                      handleApproveDatadog();
                      showNotice('Datadog APM approved via FastMCP Proxy');
                    }}
                    style={{ fontSize: '12px', padding: '9px 12px', width: '100%', justifyContent: 'center' }}
                  >
                    Approve Mandate
                  </button>
                  <button
                    type="button"
                    className="outline-button"
                    onClick={() => navigateTo('subscriptions')}
                    style={{ fontSize: '12px', padding: '9px 12px', width: '100%', justifyContent: 'center' }}
                  >
                    View in Ledger
                  </button>
                </div>
              </div>
            </div>

            {/* Full-Width Protection Gantt Timeline */}
            <div style={{ marginTop: '28px' }}>
              <div className="section-heading" style={{ marginBottom: '16px' }}>
                <div>
                  <span className="eyebrow"><SubGuardIcon name="calendar" size={13} /> PROTECTION TIMELINE</span>
                  <h2>Visual Cancellation Safeguard Schedule</h2>
                </div>
              </div>
              <RenewalTimeline subscriptions={subscriptions} />
            </div>
          </div>
        )}

        {(activeNav === 'home' || !activeNav) && (
          <div className="page-container" id="home">
            {/* SECTION 1: Welcome Grid */}
            <section className="welcome-section">
              <div className="welcome-grid">
                <div className="welcome-copy">
                  <button
                    type="button"
                    className={`eyebrow status-${subscriptionHealth.badgeTone}`}
                    onClick={() => {
                      if (!shieldOn) {
                        setShieldOn(true);
                        showNotice('Autopilot protection resumed: active contracts guarded');
                      } else if (subscriptionHealth.statusType === 'attention') {
                        navigateTo('protection');
                      } else if (subscriptionHealth.statusType === 'warning') {
                        setIsAccountOpen(true);
                      } else {
                        navigateTo('protection');
                      }
                    }}
                    title={subscriptionHealth.badgeActionTooltip || "Click to inspect protection details"}
                    aria-label={subscriptionHealth.badgeText}
                  >
                    <span className={`eyebrow-dot pulse ${subscriptionHealth.badgeTone}`} />
                    <SubGuardIcon name={subscriptionHealth.badgeIcon || "shield"} size={13} />
                    <span>{subscriptionHealth.badgeText}</span>
                  </button>

                  <h1>
                    {greeting}, {user.firstName || 'Alex'}.
                    <br />
                    {subscriptionHealth.prefix}
                    <em className={`health-highlight ${subscriptionHealth.statusType}`}>
                      {subscriptionHealth.highlight}
                    </em>
                  </h1>

                  <p className="intro">
                    {subscriptionHealth.description}
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
                    <button
                      type="button"
                      className="primary-button"
                      onClick={() => navigateTo('discover')}
                    >
                      Discover software <SubGuardIcon name="arrow" size={17} />
                    </button>
                    <button
                      type="button"
                      className="text-button"
                      onClick={() => navigateTo('subscriptions')}
                    >
                      Review my subscriptions <SubGuardIcon name="chevron" size={15} />
                    </button>
                  </div>
                </div>

                {/* Autopilot Cancellation Shield Panel */}
                <aside className={`shield-panel ${shieldOn ? '' : 'shield-off'}`} id="protection">
                  <div className="shield-heading">
                    <div>
                      <span className="live-label">
                        <i /> {shieldOn ? 'SUBGUARD AUTOPILOT' : 'AUTOPILOT PAUSED'}
                      </span>
                      <h2>Cancellation Shield</h2>
                    </div>
                    <button
                      className={`toggle ${shieldOn ? 'on' : ''}`}
                      aria-pressed={shieldOn}
                      onClick={() => {
                        setShieldOn(!shieldOn);
                        showNotice(shieldOn ? 'Autopilot protection paused' : 'Autopilot protection resumed');
                      }}
                      type="button"
                    >
                      <span />
                    </button>
                  </div>

                  <div className={`shield-visual ${shieldOn ? '' : 'is-paused'}`}>
                    <div className="orbit orbit-one" />
                    <div className="orbit orbit-two" />
                    <div className="shield-core">
                      <SubGuardIcon name={shieldOn ? "shield" : "shield-pause"} size={26} stroke={2.2} />
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
                      <SubGuardIcon name={shieldOn ? "wand" : "alert"} size={17} />
                    </span>
                    <div>
                      <small>{shieldOn ? 'WHAT HAPPENS NEXT' : 'PROTECTION HALTED'}</small>
                      <p>
                        {shieldOn
                          ? 'We’ll check in 48 hours before billing. No reply? We cancel it for you.'
                          : 'Automated cancellation is currently disabled.'}
                      </p>
                    </div>
                  </div>

                  <button
                    className="shield-link"
                    onClick={() => navigateTo('protection')}
                    type="button"
                  >
                    Open Protection Center <SubGuardIcon name="arrow" size={16} />
                  </button>
                </aside>
              </div>

              {/* Full-Width Overview Metrics & Actionable Renewal Alert */}
              <div className="hero-bottom-band">
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

                {/* Actionable Upcoming Renewal Alert Banner */}
                <div className="renewal-ribbon">
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
                    onClick={() => {
                      showNotice('Notion Plus renewal: monitored under $50.00 spending policy');
                      navigateTo('subscriptions');
                    }}
                    type="button"
                  >
                    Review renewal <SubGuardIcon name="arrow" size={16} />
                  </button>
                </div>
              </div>
            </section>

            {/* Quick Destinations Shortcuts Grid */}
            <div className="home-shortcuts-grid">
              <div className="home-shortcut-card">
                <div>
                  <div className="shortcut-card-header">
                    <span className="shortcut-card-icon">
                      <SubGuardIcon name="compass" size={20} />
                    </span>
                    <h3>SaaS Marketplace</h3>
                  </div>
                  <p>
                    Browse verified developer tools with transparent pricing, star ratings, and pre-negotiated cancel-ready mandates.
                  </p>
                </div>
                <button
                  type="button"
                  className="outline-button"
                  onClick={() => navigateTo('discover')}
                >
                  Browse Software <SubGuardIcon name="arrow" size={14} />
                </button>
              </div>

              <div className="home-shortcut-card">
                <div>
                  <div className="shortcut-card-header">
                    <span className="shortcut-card-icon">
                      <SubGuardIcon name="shield" size={20} />
                    </span>
                    <h3>Autopilot Protection</h3>
                  </div>
                  <p>
                    Cursor Pro trial cancellation armed for Nov 10. Autonomous spending ceiling enforced at $50.00/mo.
                  </p>
                </div>
                <button
                  type="button"
                  className="outline-button"
                  onClick={() => navigateTo('protection')}
                >
                  Inspect Protection <SubGuardIcon name="arrow" size={14} />
                </button>
              </div>
            </div>

            {/* SECTION: The SubGuard Promise */}
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
              <button
                type="button"
                className="outline-button promise-cta"
                onClick={() => navigateTo('protection')}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  padding: '12px 15px',
                  borderRadius: '9px',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                How protection works <SubGuardIcon name="arrow" size={17} />
              </button>
            </section>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer>
        <a
          className="brand footer-brand"
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            navigateTo('home');
          }}
        >
          <span className="brand-mark">
            <SubGuardIcon name="bag" size={18} />
          </span>
          <span className="brand-name">SubGuard</span>
        </a>
        <p>Your software. Your money. Protected.</p>
        <span>© 2026 SubGuard</span>
      </footer>

      {/* Notifications Drawer */}
      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onNavigate={navigateTo}
        onApproveDatadog={handleApproveDatadog}
      />

      {/* Governance & Security Passport Modal */}
      <AccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        spendingCap={spendingCap}
        onUpdateSpendingCap={handleUpdateSpendingCap}
        user={user}
        onUpdateUser={handleUpdateUser}
      />
    </div>
  );
}
