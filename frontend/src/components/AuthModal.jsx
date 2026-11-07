import React, { useState } from 'react';
import SubGuardIcon from './SubGuardIcon';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ isOpen, onClose, initialTab = 'signin' }) {
  const { login, register, defaultPersonas, switchDemoPersona } = useAuth();
  const [tab, setTab] = useState(initialTab);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sign In Form State
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  // Register Form State
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regOrg, setRegOrg] = useState('');
  const [regRole, setRegRole] = useState('Founder Admin');
  const [regPassword, setRegPassword] = useState('');
  const [regMonthlyCap, setRegMonthlyCap] = useState(500);
  const [regSingleLimit, setRegSingleLimit] = useState(50);
  const [regColor, setRegColor] = useState('#2edcc4');

  React.useEffect(() => {
    setTab(initialTab);
    setErrorMsg('');
  }, [initialTab, isOpen]);

  if (!isOpen) return null;

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!signInEmail || !signInPassword) {
      setErrorMsg('Please enter both work email and password.');
      return;
    }

    setIsSubmitting(true);
    const result = await login(signInEmail, signInPassword);
    setIsSubmitting(false);

    if (result.success) {
      onClose();
    } else {
      setErrorMsg(result.error || 'Authentication failed. Please verify credentials.');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!regFullName.trim()) {
      setErrorMsg('Full name is required.');
      return;
    }
    if (!regEmail.trim()) {
      setErrorMsg('Work email is required.');
      return;
    }
    if (!regPassword || regPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    setIsSubmitting(true);
    const result = await register({
      fullName: regFullName.trim(),
      email: regEmail.trim(),
      organization: regOrg.trim() || 'Personal Workspace',
      role: regRole,
      password: regPassword,
      monthlyBudgetCeiling: Number(regMonthlyCap),
      singleTransactionLimit: Number(regSingleLimit),
      avatarColor: regColor
    });
    setIsSubmitting(false);

    if (result.success) {
      onClose();
    } else {
      setErrorMsg(result.error || 'Registration failed.');
    }
  };

  const AVATAR_PALETTE = ['#2edcc4', '#f9dec9', '#ff4d6d', '#0d9488', '#38bdf8'];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(6, 7, 35, 0.65)',
        backdropFilter: 'blur(8px)',
        zIndex: 1050,
        display: 'grid',
        placeItems: 'center',
        padding: '16px'
      }}
      onClick={onClose}
    >
      <div
        className="auth-modal-card"
        style={{
          backgroundColor: 'var(--surface, #ffffff)',
          color: 'var(--navy, #060723)',
          borderRadius: '20px',
          width: '100%',
          maxWidth: '520px',
          boxShadow: '0 24px 60px rgba(6, 7, 35, 0.25), 4px 4px 0px var(--line, #a6bbe2)',
          border: '1.5px solid var(--line, #a6bbe2)',
          overflow: 'hidden',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          animation: 'toast-in 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Topbar Tabs */}
        <div
          style={{
            padding: '16px 22px',
            borderBottom: '1.5px solid var(--line, #a6bbe2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--surface-soft, #f0f4fe)'
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              padding: '4px',
              borderRadius: '999px',
              background: 'rgba(6, 7, 35, 0.08)',
              gap: '4px'
            }}
          >
            <button
              type="button"
              onClick={() => { setTab('signin'); setErrorMsg(''); }}
              style={{
                border: 'none',
                background: tab === 'signin' ? '#060723' : 'transparent',
                color: tab === 'signin' ? '#ffffff' : 'var(--muted, #4a5578)',
                padding: '6px 16px',
                borderRadius: '999px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.16s ease'
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setTab('register'); setErrorMsg(''); }}
              style={{
                border: 'none',
                background: tab === 'register' ? '#060723' : 'transparent',
                color: tab === 'register' ? '#ffffff' : 'var(--muted, #4a5578)',
                padding: '6px 16px',
                borderRadius: '999px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.16s ease'
              }}
            >
              Create Account
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close authentication modal"
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--muted, #4a5578)',
              padding: '6px',
              display: 'grid',
              placeItems: 'center',
              borderRadius: '6px'
            }}
          >
            <SubGuardIcon name="chevron" size={16} />
          </button>
        </div>

        {/* Modal Body Scrollable Area */}
        <div style={{ padding: '24px 26px', overflowY: 'auto' }}>
          {/* Header Lockup */}
          <div style={{ marginBottom: '20px', textAlign: 'center' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: '#060723',
                color: '#2edcc4',
                display: 'grid',
                placeItems: 'center',
                margin: '0 auto 10px',
                border: '1.5px solid #2edcc4',
                boxShadow: '0 0 14px rgba(46, 220, 196, 0.3)'
              }}
            >
              <SubGuardIcon name="shield" size={22} />
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-serif, "Instrument Serif")',
                fontSize: '26px',
                margin: '0 0 4px',
                fontWeight: 400
              }}
            >
              {tab === 'signin' ? 'Welcome Back to SubGuard' : 'Create Protected Account'}
            </h2>
            <p
              style={{
                fontSize: '12px',
                color: 'var(--muted, #4a5578)',
                margin: 0,
                lineHeight: 1.4
              }}
            >
              {tab === 'signin'
                ? 'Sign in to govern autonomous agent spending and AP2 mandates.'
                : 'Join SubGuard to safeguard trials and enforce spending ceilings.'}
            </p>
          </div>

          {/* Error Message Callout */}
          {errorMsg && (
            <div
              style={{
                backgroundColor: '#fef2f2',
                border: '1.5px solid #fca5a5',
                color: '#991b1b',
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 600,
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <SubGuardIcon name="alert" size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* TAB 1: Sign In */}
          {tab === 'signin' && (
            <form onSubmit={handleSignInSubmit}>
              <div style={{ marginBottom: '14px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: 'var(--muted, #4a5578)',
                    marginBottom: '6px'
                  }}
                >
                  Work Email
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="email"
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    placeholder="alex.morgan@subguard.dev"
                    required
                    style={{
                      width: '100%',
                      padding: '10px 14px 10px 36px',
                      borderRadius: '8px',
                      border: '1.5px solid var(--line, #a6bbe2)',
                      background: 'var(--surface-soft, #f0f4fe)',
                      color: 'var(--navy, #060723)',
                      fontSize: '13px',
                      outline: 'none',
                      fontFamily: 'var(--font-sans)'
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--muted, #4a5578)'
                    }}
                  >
                    <SubGuardIcon name="user" size={16} />
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: 'var(--muted, #4a5578)',
                    marginBottom: '6px'
                  }}
                >
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    placeholder="Enter password (e.g. subguard2026!)"
                    required
                    style={{
                      width: '100%',
                      padding: '10px 38px 10px 36px',
                      borderRadius: '8px',
                      border: '1.5px solid var(--line, #a6bbe2)',
                      background: 'var(--surface-soft, #f0f4fe)',
                      color: 'var(--navy, #060723)',
                      fontSize: '13px',
                      outline: 'none',
                      fontFamily: 'var(--font-sans)'
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--muted, #4a5578)'
                    }}
                  >
                    <SubGuardIcon name="lock" size={16} />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--muted, #4a5578)',
                      padding: '4px'
                    }}
                  >
                    <SubGuardIcon name={showPassword ? 'eye-off' : 'eye'} size={16} />
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="primary-button"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  padding: '12px',
                  marginBottom: '20px'
                }}
              >
                {isSubmitting ? 'Authenticating...' : 'Sign In to SubGuard'} <SubGuardIcon name="arrow" size={16} />
              </button>

              {/* 1-Click Fast Demo Personas for Judges */}
              <div
                style={{
                  borderTop: '1px dashed var(--line, #a6bbe2)',
                  paddingTop: '16px',
                  marginTop: '12px'
                }}
              >
                <span
                  style={{
                    display: 'block',
                    fontSize: '10px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: 'var(--muted, #4a5578)',
                    marginBottom: '8px',
                    textAlign: 'center'
                  }}
                >
                  Quick Demo Sign In (1-Click Evaluation)
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {defaultPersonas.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        switchDemoPersona(p.id);
                        onClose();
                      }}
                      style={{
                        padding: '8px',
                        borderRadius: '8px',
                        border: '1px solid var(--line, #a6bbe2)',
                        background: 'var(--surface-soft, #f0f4fe)',
                        cursor: 'pointer',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px',
                        transition: 'transform 0.12s ease'
                      }}
                      title={`Sign in as ${p.fullName} (${p.role})`}
                    >
                      <span
                        style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: '50%',
                          background: p.avatarColor,
                          color: '#060723',
                          fontSize: '10px',
                          fontWeight: 800,
                          display: 'grid',
                          placeItems: 'center'
                        }}
                      >
                        {p.initials}
                      </span>
                      <strong style={{ fontSize: '11px', color: 'var(--navy, #060723)' }}>{p.firstName}</strong>
                      <small style={{ fontSize: '9px', color: 'var(--muted, #4a5578)' }}>{p.role.split(' ')[0]}</small>
                    </button>
                  ))}
                </div>
              </div>
            </form>
          )}

          {/* TAB 2: Register */}
          {tab === 'register' && (
            <form onSubmit={handleRegisterSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '11px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      color: 'var(--muted, #4a5578)',
                      marginBottom: '6px'
                    }}
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    placeholder="Elena Rostova"
                    required
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1.5px solid var(--line, #a6bbe2)',
                      background: 'var(--surface-soft, #f0f4fe)',
                      color: 'var(--navy, #060723)',
                      fontSize: '13px',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '11px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      color: 'var(--muted, #4a5578)',
                      marginBottom: '6px'
                    }}
                  >
                    Organization
                  </label>
                  <input
                    type="text"
                    value={regOrg}
                    onChange={(e) => setRegOrg(e.target.value)}
                    placeholder="Acme Cybernetics"
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1.5px solid var(--line, #a6bbe2)',
                      background: 'var(--surface-soft, #f0f4fe)',
                      color: 'var(--navy, #060723)',
                      fontSize: '13px',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: 'var(--muted, #4a5578)',
                    marginBottom: '6px'
                  }}
                >
                  Work Email
                </label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="elena@acme-corp.io"
                  required
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1.5px solid var(--line, #a6bbe2)',
                    background: 'var(--surface-soft, #f0f4fe)',
                    color: 'var(--navy, #060723)',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '11px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      color: 'var(--muted, #4a5578)',
                      marginBottom: '6px'
                    }}
                  >
                    Role Title
                  </label>
                  <select
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1.5px solid var(--line, #a6bbe2)',
                      background: 'var(--surface-soft, #f0f4fe)',
                      color: 'var(--navy, #060723)',
                      fontSize: '13px',
                      outline: 'none'
                    }}
                  >
                    <option value="Founder Admin">Founder Admin</option>
                    <option value="DevOps Lead">DevOps Lead</option>
                    <option value="Finance Officer">Finance Officer</option>
                    <option value="Engineering Manager">Engineering Manager</option>
                    <option value="Procurement Specialist">Procurement Specialist</option>
                  </select>
                </div>

                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '11px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      color: 'var(--muted, #4a5578)',
                      marginBottom: '6px'
                    }}
                  >
                    Avatar Color
                  </label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', height: '38px' }}>
                    {AVATAR_PALETTE.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setRegColor(color)}
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: color,
                          border: regColor === color ? '2px solid #060723' : '1px solid rgba(0,0,0,0.2)',
                          boxShadow: regColor === color ? '0 0 6px rgba(46, 220, 196, 0.6)' : 'none',
                          cursor: 'pointer'
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: 'var(--muted, #4a5578)',
                    marginBottom: '6px'
                  }}
                >
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Create secure password (min 6 chars)"
                    required
                    style={{
                      width: '100%',
                      padding: '9px 38px 9px 12px',
                      borderRadius: '8px',
                      border: '1.5px solid var(--line, #a6bbe2)',
                      background: 'var(--surface-soft, #f0f4fe)',
                      color: 'var(--navy, #060723)',
                      fontSize: '13px',
                      outline: 'none'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--muted, #4a5578)',
                      padding: '4px'
                    }}
                  >
                    <SubGuardIcon name={showPassword ? 'eye-off' : 'eye'} size={16} />
                  </button>
                </div>
              </div>

              {/* Governance Ceilings Initial Settings */}
              <div
                style={{
                  padding: '12px 14px',
                  borderRadius: '10px',
                  background: 'var(--surface-soft, #f0f4fe)',
                  border: '1px solid var(--line, #a6bbe2)',
                  marginBottom: '18px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                  <SubGuardIcon name="bolt" size={14} />
                  <strong style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    AP2 Deterministic Ceilings
                  </strong>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '10px', color: 'var(--muted, #4a5578)', display: 'block', marginBottom: '4px' }}>
                      Single Autonomous Limit: ${regSingleLimit}.00
                    </label>
                    <input
                      type="range"
                      min={10}
                      max={200}
                      step={10}
                      value={regSingleLimit}
                      onChange={(e) => setRegSingleLimit(Number(e.target.value))}
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '10px', color: 'var(--muted, #4a5578)', display: 'block', marginBottom: '4px' }}>
                      Monthly Spend Cap: ${regMonthlyCap}.00
                    </label>
                    <input
                      type="range"
                      min={100}
                      max={2000}
                      step={50}
                      value={regMonthlyCap}
                      onChange={(e) => setRegMonthlyCap(Number(e.target.value))}
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>
                <small style={{ display: 'block', marginTop: '6px', fontSize: '9px', color: 'var(--green, #216e65)' }}>
                  An Ed25519 cryptographic signing key will be automatically generated.
                </small>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="primary-button"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  padding: '12px'
                }}
              >
                {isSubmitting ? 'Creating Profile & Generating Keys...' : 'Create Protected Account'} <SubGuardIcon name="check" size={16} />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
