import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

const DEFAULT_PERSONAS = [
  {
    id: 'user-demo-alex',
    email: 'alex.morgan@subguard.dev',
    fullName: 'Alex Morgan',
    firstName: 'Alex',
    initials: 'AM',
    role: 'Founder Admin',
    avatarColor: '#2edcc4',
    organization: 'PayPal Dev Sandbox Organization',
    monthlyBudgetCeiling: 500.0,
    singleTransactionLimit: 50.0,
    publicSigningKey: '-----BEGIN PUBLIC KEY-----\nMCowBQYDK2VwAyEAxK9subguard2026Ed25519DemoPublicKeySignature==\n-----END PUBLIC KEY-----'
  },
  {
    id: 'user-demo-sarah',
    email: 'sarah.connor@cyberdyne.ai',
    fullName: 'Sarah Connor',
    firstName: 'Sarah',
    initials: 'SC',
    role: 'DevOps Lead',
    avatarColor: '#f9dec9',
    organization: 'Cyberdyne AI Systems',
    monthlyBudgetCeiling: 1200.0,
    singleTransactionLimit: 100.0,
    publicSigningKey: '-----BEGIN PUBLIC KEY-----\nMCowBQYDK2VwAyEAsarah2026DevOpsEd25519PublicKeySignature==\n-----END PUBLIC KEY-----'
  },
  {
    id: 'user-demo-david',
    email: 'david.chen@fintechflow.com',
    fullName: 'David Chen',
    firstName: 'David',
    initials: 'DC',
    role: 'Procurement Specialist',
    avatarColor: '#ff4d6d',
    organization: 'FinTech Flow Capital',
    monthlyBudgetCeiling: 2500.0,
    singleTransactionLimit: 250.0,
    publicSigningKey: '-----BEGIN PUBLIC KEY-----\nMCowBQYDK2VwAyEAdavid2026ProcurementEd25519KeySignature==\n-----END PUBLIC KEY-----'
  }
];

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem('subguard-token') || null;
    } catch {
      return null;
    }
  });

  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('subguard-user');
      if (savedUser) {
        return JSON.parse(savedUser);
      }
    } catch {
      // fallback
    }
    return DEFAULT_PERSONAS[0];
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return Boolean(localStorage.getItem('subguard-token') || localStorage.getItem('subguard-user'));
    } catch {
      return true;
    }
  });

  const [authModalConfig, setAuthModalConfig] = useState({
    isOpen: false,
    initialTab: 'signin'
  });

  const openAuthModal = useCallback((initialTab = 'signin') => {
    setAuthModalConfig({ isOpen: true, initialTab });
  }, []);

  const closeAuthModal = useCallback(() => {
    setAuthModalConfig((prev) => ({ ...prev, isOpen: false }));
  }, []);

  // Sync session state to storage
  const persistSession = useCallback((newUser, newToken) => {
    setUser(newUser);
    setToken(newToken);
    setIsAuthenticated(true);
    try {
      localStorage.setItem('subguard-user', JSON.stringify(newUser));
      if (newToken) {
        localStorage.setItem('subguard-token', newToken);
      }
    } catch {
      // ignore
    }
  }, []);

  const clearSession = useCallback(() => {
    setToken(null);
    setIsAuthenticated(false);
    try {
      localStorage.removeItem('subguard-token');
      localStorage.removeItem('subguard-user');
    } catch {
      // ignore
    }
  }, []);

  // Login handler
  const login = async (email, password) => {
    try {
      const res = await fetch('http://localhost:8000/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (res.ok) {
        const data = await res.json();
        const mappedUser = {
          id: data.user.id,
          email: data.user.email,
          fullName: data.user.full_name,
          firstName: data.user.first_name,
          initials: data.user.initials,
          role: data.user.role,
          avatarColor: data.user.avatar_color,
          organization: data.user.organization_name,
          monthlyBudgetCeiling: data.user.monthly_budget_ceiling,
          singleTransactionLimit: data.user.single_transaction_limit,
          publicSigningKey: data.user.public_signing_key
        };
        persistSession(mappedUser, data.token);
        closeAuthModal();
        return { success: true, user: mappedUser };
      } else {
        const err = await res.json().catch(() => ({}));
        return { success: false, error: err.detail || 'Invalid email or password.' };
      }
    } catch {
      // Graceful offline mock fallback
      const cleanEmail = email.trim().toLowerCase();
      const match = DEFAULT_PERSONAS.find((p) => p.email.toLowerCase() === cleanEmail);
      if (match) {
        persistSession(match, `simulated-token-${Date.now()}`);
        closeAuthModal();
        return { success: true, user: match };
      }
      return {
        success: false,
        error: 'Backend authentication service offline. You can use the 1-click demo persona buttons below.'
      };
    }
  };

  // Register handler
  const register = async (formData) => {
    try {
      const res = await fetch('http://localhost:8000/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          full_name: formData.fullName,
          organization_name: formData.organization || 'Personal Workspace',
          role: formData.role || 'Admin',
          monthly_budget_ceiling: formData.monthlyBudgetCeiling || 500.0,
          single_transaction_limit: formData.singleTransactionLimit || 50.0,
          avatar_color: formData.avatarColor || '#2edcc4'
        })
      });

      if (res.ok) {
        const data = await res.json();
        const mappedUser = {
          id: data.user.id,
          email: data.user.email,
          fullName: data.user.full_name,
          firstName: data.user.first_name,
          initials: data.user.initials,
          role: data.user.role,
          avatarColor: data.user.avatar_color,
          organization: data.user.organization_name,
          monthlyBudgetCeiling: data.user.monthly_budget_ceiling,
          singleTransactionLimit: data.user.single_transaction_limit,
          publicSigningKey: data.user.public_signing_key
        };
        persistSession(mappedUser, data.token);
        closeAuthModal();
        return { success: true, user: mappedUser };
      } else {
        const err = await res.json().catch(() => ({}));
        return { success: false, error: err.detail || 'Registration failed.' };
      }
    } catch {
      // Offline fallback: create local user
      const parts = formData.fullName.trim().split(' ');
      const initials = parts.length > 1
        ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
        : (parts[0].slice(0, 2)).toUpperCase();

      const newUser = {
        id: `user-${Date.now()}`,
        email: formData.email,
        fullName: formData.fullName,
        firstName: parts[0] || 'Member',
        initials,
        role: formData.role || 'Admin',
        avatarColor: formData.avatarColor || '#2edcc4',
        organization: formData.organization || 'Personal Workspace',
        monthlyBudgetCeiling: formData.monthlyBudgetCeiling || 500.0,
        singleTransactionLimit: formData.singleTransactionLimit || 50.0,
        publicSigningKey: '-----BEGIN PUBLIC KEY-----\nMCowBQYDK2VwAyEA' + btoa(formData.email).slice(0, 32) + 'DemoAP2Key==\n-----END PUBLIC KEY-----'
      };
      persistSession(newUser, `simulated-token-${Date.now()}`);
      closeAuthModal();
      return { success: true, user: newUser };
    }
  };

  // Logout handler
  const logout = useCallback(() => {
    clearSession();
    // Default back to Alex Morgan demo persona in unauthenticated view
    setUser(DEFAULT_PERSONAS[0]);
  }, [clearSession]);

  // Update Profile
  const updateProfile = async (updates) => {
    const updated = { ...user, ...updates };
    if (updates.fullName) {
      const parts = updates.fullName.trim().split(' ');
      updated.firstName = parts[0] || 'Member';
      updated.initials = parts.length > 1
        ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
        : (parts[0].slice(0, 2)).toUpperCase();
    }
    setUser(updated);
    try {
      localStorage.setItem('subguard-user', JSON.stringify(updated));
    } catch {
      // ignore
    }

    if (token) {
      try {
        await fetch('http://localhost:8000/v1/auth/profile', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            full_name: updates.fullName,
            organization_name: updates.organization,
            role: updates.role,
            avatar_color: updates.avatarColor,
            monthly_budget_ceiling: updates.monthlyBudgetCeiling,
            single_transaction_limit: updates.singleTransactionLimit
          })
        });
      } catch {
        // offline fallback
      }
    }
  };

  // Rotate Ed25519 Keys
  const rotateKeys = async () => {
    if (token) {
      try {
        const res = await fetch('http://localhost:8000/v1/auth/keys/rotate', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          updateProfile({ publicSigningKey: data.public_signing_key });
          return data.public_signing_key;
        }
      } catch {
        // fallback
      }
    }
    const newSimulatedKey = `-----BEGIN PUBLIC KEY-----\nMCowBQYDK2VwAyEARotatedKey${Date.now()}AP2PublicKey==\n-----END PUBLIC KEY-----`;
    updateProfile({ publicSigningKey: newSimulatedKey });
    return newSimulatedKey;
  };

  // Switch demo persona
  const switchDemoPersona = (personaId) => {
    const persona = DEFAULT_PERSONAS.find((p) => p.id === personaId) || DEFAULT_PERSONAS[0];
    persistSession(persona, `simulated-token-${persona.id}`);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        authModalConfig,
        openAuthModal,
        closeAuthModal,
        login,
        register,
        logout,
        updateProfile,
        rotateKeys,
        switchDemoPersona,
        defaultPersonas: DEFAULT_PERSONAS
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

