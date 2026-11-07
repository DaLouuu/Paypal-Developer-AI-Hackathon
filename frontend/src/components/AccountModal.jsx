import React, { useState } from 'react';
import SubGuardIcon from './SubGuardIcon';
import { useAuth } from '../context/AuthContext';

export default function AccountModal({
  isOpen,
  onClose,
  spendingCap = 50,
  onUpdateSpendingCap
}) {
  const {
    user,
    isAuthenticated,
    updateProfile,
    rotateKeys,
    logout,
    openAuthModal,
    defaultPersonas,
    switchDemoPersona
  } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [rotatingKeys, setRotatingKeys] = useState(false);

  // Form State for editing
  const [tempName, setTempName] = useState(user?.fullName || 'Alex Morgan');
  const [tempEmail, setTempEmail] = useState(user?.email || 'alex.morgan@subguard.dev');
  const [tempOrg, setTempOrg] = useState(user?.organization || 'PayPal Dev Sandbox Organization');
  const [tempRole, setTempRole] = useState(user?.role || 'Founder Admin');
  const [tempCap, setTempCap] = useState(user?.singleTransactionLimit || spendingCap || 50);
  const [tempMonthlyCap, setTempMonthlyCap] = useState(user?.monthlyBudgetCeiling || 500);
  const [tempColor, setTempColor] = useState(user?.avatarColor || '#2edcc4');

  React.useEffect(() => {
    if (user) {
      setTempName(user.fullName || 'Alex Morgan');
      setTempEmail(user.email || 'alex.morgan@subguard.dev');
      setTempOrg(user.organization || 'PayPal Dev Sandbox Organization');
      setTempRole(user.role || 'Founder Admin');
      setTempCap(user.singleTransactionLimit || spendingCap || 50);
      setTempMonthlyCap(user.monthlyBudgetCeiling || 500);
      setTempColor(user.avatarColor || '#2edcc4');
    }
  }, [user, spendingCap, isOpen]);

  if (!isOpen) return null;

  const handleSaveProfile = async () => {
    await updateProfile({
      fullName: tempName.trim(),
      email: tempEmail.trim(),
      organization: tempOrg.trim(),
      role: tempRole,
      singleTransactionLimit: Number(tempCap),
      monthlyBudgetCeiling: Number(tempMonthlyCap),
      avatarColor: tempColor
    });
    if (onUpdateSpendingCap) {
      onUpdateSpendingCap(Number(tempCap));
    }
    setIsEditing(false);
  };

  const handleCopyKey = () => {
    if (user?.publicSigningKey) {
      navigator.clipboard?.writeText(user.publicSigningKey);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    }
  };

  const handleRotateKeypair = async () => {
    setRotatingKeys(true);
    await rotateKeys();
    setRotatingKeys(false);
  };

  const AVATAR_PALETTE = ['#2edcc4', '#f9dec9', '#ff4d6d', '#0d9488', '#38bdf8'];

  // Fingerprint calculation from public key
  const keySnippet = user?.publicSigningKey
    ? user.publicSigningKey.slice(28, 44).toLowerCase().replace(/[^a-z0-9]/g, '')
    : 'e4a799b2';
  const fingerprint = `ed25519:${keySnippet.slice(0, 4)}...${keySnippet.slice(-4)}`;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(6, 7, 35, 0.65)',
        backdropFilter: 'blur(8px)',
        zIndex: 1000,
        display: 'grid',
        placeItems: 'center',
        padding: '16px'
      }}
      onClick={onClose}
    >
      <div
        className="account-modal-card"
        style={{
          backgroundColor: 'var(--surface, #ffffff)',
          color: 'var(--navy, #060723)',
          borderRadius: '20px',
          width: '100%',
          maxWidth: '560px',
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
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1.5px solid var(--line, #a6bbe2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--surface-soft, #f0f4fe)',
            flexShrink: 0
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: user?.avatarColor || '#2edcc4',
                color: '#060723',
                display: 'grid',
                placeItems: 'center',
                fontWeight: 800,
                fontSize: '14px',
                flexShrink: 0,
                border: '1.5px solid rgba(6, 7, 35, 0.2)',
                boxShadow: '0 2px 8px rgba(6, 7, 35, 0.12)'
              }}
            >
              {user?.initials || 'AM'}
            </span>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 700, fontFamily: 'var(--font-sans)' }}>
                  {user?.fullName || 'Alex Morgan'}
                </h3>
                <span className="badge-verified">
                  VERIFIED PRINCIPAL
                </span>
              </div>
              <small style={{ color: 'var(--muted, #4a5578)', fontSize: '11px', display: 'block', marginTop: '2px' }}>
                {user?.role || 'Founder Admin'} · {user?.organization || 'PayPal Dev Sandbox Organization'}
              </small>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
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

        {/* Scrollable Content */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', flex: 1, minHeight: 0, overflowY: 'auto' }}>
          
          {/* Section 1: Profile & Identity Information */}
          <div
            style={{
              padding: '16px 18px',
              borderRadius: '12px',
              background: 'var(--surface-soft, #f0f4fe)',
              border: '1px solid var(--line, #a6bbe2)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, color: 'var(--muted, #4a5578)' }}>
                Principal Identity & Organization
              </span>
              <button
                type="button"
                className="text-button"
                onClick={() => setIsEditing(!isEditing)}
                style={{ fontSize: '11px', color: 'var(--blue, #216e65)', fontWeight: 700 }}
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            {isEditing ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '10px', fontWeight: 700, color: 'var(--muted, #4a5578)', display: 'block', marginBottom: '4px' }}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        borderRadius: '6px',
                        border: '1.5px solid var(--line, #a6bbe2)',
                        background: 'var(--surface, #ffffff)',
                        color: 'var(--navy, #060723)',
                        fontSize: '12px'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '10px', fontWeight: 700, color: 'var(--muted, #4a5578)', display: 'block', marginBottom: '4px' }}>
                      Work Email
                    </label>
                    <input
                      type="email"
                      value={tempEmail}
                      onChange={(e) => setTempEmail(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        borderRadius: '6px',
                        border: '1.5px solid var(--line, #a6bbe2)',
                        background: 'var(--surface, #ffffff)',
                        color: 'var(--navy, #060723)',
                        fontSize: '12px'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '10px', fontWeight: 700, color: 'var(--muted, #4a5578)', display: 'block', marginBottom: '4px' }}>
                      Organization
                    </label>
                    <input
                      type="text"
                      value={tempOrg}
                      onChange={(e) => setTempOrg(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        borderRadius: '6px',
                        border: '1.5px solid var(--line, #a6bbe2)',
                        background: 'var(--surface, #ffffff)',
                        color: 'var(--navy, #060723)',
                        fontSize: '12px'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '10px', fontWeight: 700, color: 'var(--muted, #4a5578)', display: 'block', marginBottom: '4px' }}>
                      Role Title
                    </label>
                    <select
                      value={tempRole}
                      onChange={(e) => setTempRole(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        borderRadius: '6px',
                        border: '1.5px solid var(--line, #a6bbe2)',
                        background: 'var(--surface, #ffffff)',
                        color: 'var(--navy, #060723)',
                        fontSize: '12px'
                      }}
                    >
                      <option value="Founder Admin">Founder Admin</option>
                      <option value="DevOps Lead">DevOps Lead</option>
                      <option value="Chief Financial Officer">Chief Financial Officer</option>
                      <option value="Engineering Manager">Engineering Manager</option>
                      <option value="Procurement Specialist">Procurement Specialist</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '10px', fontWeight: 700, color: 'var(--muted, #4a5578)', display: 'block', marginBottom: '4px' }}>
                    Avatar Accent
                  </label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {AVATAR_PALETTE.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setTempColor(color)}
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: color,
                          border: tempColor === color ? '2px solid #060723' : '1px solid rgba(0,0,0,0.2)',
                          boxShadow: tempColor === color ? '0 0 6px rgba(46, 220, 196, 0.6)' : 'none',
                          cursor: 'pointer'
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    style={{
                      border: '1px solid var(--line, #a6bbe2)',
                      background: 'transparent',
                      color: 'var(--muted, #4a5578)',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveProfile}
                    className="primary-button"
                    style={{ padding: '6px 16px', fontSize: '11px' }}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', fontSize: '12px' }}>
                <div>
                  <small style={{ fontSize: '10px', color: 'var(--muted, #4a5578)', display: 'block' }}>Email</small>
                  <strong style={{ fontSize: '12px', wordBreak: 'break-all' }}>{user?.email || 'alex.morgan@subguard.dev'}</strong>
                </div>
                <div>
                  <small style={{ fontSize: '10px', color: 'var(--muted, #4a5578)', display: 'block' }}>Role</small>
                  <strong style={{ fontSize: '12px' }}>{user?.role || 'Founder Admin'}</strong>
                </div>
                <div>
                  <small style={{ fontSize: '10px', color: 'var(--muted, #4a5578)', display: 'block' }}>Organization</small>
                  <strong style={{ fontSize: '12px' }}>{user?.organization || 'PayPal Dev Sandbox'}</strong>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Autonomous Spending Guardrails */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, color: 'var(--muted, #4a5578)' }}>
                Autonomous Spending Guardrails
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {/* Single Transaction Ceiling */}
              <div style={{ padding: '14px', background: 'var(--surface-soft, #f0f4fe)', borderRadius: '12px', border: '1px solid var(--line, #a6bbe2)' }}>
                <small style={{ fontSize: '9px', color: 'var(--muted, #4a5578)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Single Transaction Ceiling
                </small>
                <div style={{ fontSize: '18px', fontWeight: 800, fontFamily: 'var(--font-sans)', margin: '4px 0' }}>
                  ${Number(user?.singleTransactionLimit || spendingCap || 50).toFixed(2)}
                </div>
                <small style={{ fontSize: '10px', color: 'var(--muted, #4a5578)', display: 'block', lineHeight: 1.35 }}>
                  Charges above this threshold automatically pause for human sign-off.
                </small>
              </div>

              {/* Monthly Budget Hard Cap */}
              <div style={{ padding: '14px', background: 'var(--surface-soft, #f0f4fe)', borderRadius: '12px', border: '1px solid var(--line, #a6bbe2)' }}>
                <small style={{ fontSize: '9px', color: 'var(--muted, #4a5578)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Monthly Budget Ceiling
                </small>
                <div style={{ fontSize: '18px', fontWeight: 800, fontFamily: 'var(--font-sans)', margin: '4px 0' }}>
                  ${Number(user?.monthlyBudgetCeiling || 500).toFixed(2)}
                </div>
                <small style={{ fontSize: '10px', color: 'var(--muted, #4a5578)', display: 'block', lineHeight: 1.35 }}>
                  Hard deterministic rejection limit across all autonomous mandates.
                </small>
              </div>
            </div>
          </div>

          {/* Section 3: AP2 Cryptographic Protocol Credentials */}
          <div
            style={{
              padding: '16px 18px',
              borderRadius: '12px',
              background: 'var(--surface-soft, #f0f4fe)',
              border: '1px solid var(--line, #a6bbe2)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, color: 'var(--muted, #4a5578)' }}>
                AP2 Cryptographic Identity
              </span>
              <span style={{ color: 'var(--green, #216e65)', fontWeight: 700, fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <SubGuardIcon name="check" size={13} /> Ed25519 Enforced
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--muted, #4a5578)' }}>Key Fingerprint:</span>
                <code className="fingerprint-pill" style={{ fontSize: '11px' }}>
                  {fingerprint}
                </code>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--muted, #4a5578)' }}>FastMCP Proxy Gateway:</span>
                <span style={{ fontWeight: 600, color: 'var(--navy, #060723)' }}>ONLINE (Port 8000)</span>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={handleCopyKey}
                  style={{
                    flex: 1,
                    padding: '7px 12px',
                    borderRadius: '6px',
                    border: '1px solid var(--line, #a6bbe2)',
                    background: 'var(--surface, #ffffff)',
                    color: 'var(--navy, #060723)',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <SubGuardIcon name="check" size={13} />
                  {copiedKey ? 'Public Key Copied!' : 'Copy AP2 Public Key'}
                </button>
                <button
                  type="button"
                  onClick={handleRotateKeypair}
                  disabled={rotatingKeys}
                  style={{
                    padding: '7px 12px',
                    borderRadius: '6px',
                    border: '1px solid var(--line, #a6bbe2)',
                    background: 'var(--surface, #ffffff)',
                    color: 'var(--navy, #060723)',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <SubGuardIcon name="key" size={13} />
                  {rotatingKeys ? 'Rotating...' : 'Rotate Keys'}
                </button>
              </div>
            </div>
          </div>

          {/* Section 4: Demo Persona Switcher */}
          <div
            style={{
              padding: '14px 16px',
              borderRadius: '12px',
              background: 'var(--surface-soft, #f0f4fe)',
              border: '1px dashed var(--line, #a6bbe2)'
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
                marginBottom: '8px'
              }}
            >
              Switch Demo Persona (Fast Testing)
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {defaultPersonas.map((p) => {
                const isActive = user?.email === p.email;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => switchDemoPersona(p.id)}
                    style={{
                      padding: '8px',
                      borderRadius: '8px',
                      border: isActive ? '1.5px solid var(--green, #216e65)' : '1px solid var(--line, #a6bbe2)',
                      background: isActive ? 'rgba(46, 220, 196, 0.15)' : 'var(--surface, #ffffff)',
                      cursor: 'pointer',
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <span
                      style={{
                        width: '24px',
                        height: '24px',
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
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1.5px solid var(--line, #a6bbe2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--surface-soft, #f0f4fe)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              onClick={() => {
                logout();
                onClose();
              }}
              style={{
                background: 'transparent',
                border: '1px solid #fca5a5',
                color: '#b91c1c',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Sign Out
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                openAuthModal('signin');
              }}
              style={{
                background: 'transparent',
                border: '1px solid var(--line, #a6bbe2)',
                color: 'var(--muted, #4a5578)',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Switch Account
            </button>
          </div>

          <button
            type="button"
            className="primary-button"
            onClick={onClose}
            style={{ padding: '8px 20px', fontSize: '12px' }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
