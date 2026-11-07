import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AuthProvider, useAuth } from '../context/AuthContext';
import AuthModal from '../components/AuthModal';
import AccountModal from '../components/AccountModal';

function TestWrapper({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}

describe('Authentication & Profiling Flow', () => {
  it('renders AuthModal with Sign In tab by default and evaluates 1-click personas', () => {
    const handleClose = vi.fn();

    render(
      <TestWrapper>
        <AuthModal isOpen={true} onClose={handleClose} initialTab="signin" />
      </TestWrapper>
    );

    expect(screen.getByText('Welcome Back to SubGuard')).toBeDefined();
    expect(screen.getByPlaceholderText('alex.morgan@subguard.dev')).toBeDefined();
    expect(screen.getByText('Quick Demo Sign In (1-Click Evaluation)')).toBeDefined();

    // Verify 1-click persona quick buttons
    expect(screen.getByText('Sarah')).toBeDefined();
    expect(screen.getByText('David')).toBeDefined();
  });

  it('renders Register tab and displays governance spend ceilings and role selector', () => {
    const handleClose = vi.fn();

    render(
      <TestWrapper>
        <AuthModal isOpen={true} onClose={handleClose} initialTab="register" />
      </TestWrapper>
    );

    expect(screen.getAllByText('Create Protected Account').length).toBeGreaterThan(0);
    expect(screen.getByPlaceholderText('Elena Rostova')).toBeDefined();
    expect(screen.getByPlaceholderText('Acme Cybernetics')).toBeDefined();
    expect(screen.getByText('AP2 Deterministic Ceilings')).toBeDefined();
  });

  it('renders AccountModal with governance profile, ceilings and cryptographic key fingerprint', () => {
    const handleClose = vi.fn();

    render(
      <TestWrapper>
        <AccountModal isOpen={true} onClose={handleClose} spendingCap={50} />
      </TestWrapper>
    );

    expect(screen.getByText('VERIFIED PRINCIPAL')).toBeDefined();
    expect(screen.getByText('Alex Morgan')).toBeDefined();
    expect(screen.getAllByText('Founder Admin').length).toBeGreaterThan(0);
    expect(screen.getByText('AP2 Cryptographic Identity')).toBeDefined();
    expect(screen.getByText('Ed25519 Enforced')).toBeDefined();
    expect(screen.getByText('Copy AP2 Public Key')).toBeDefined();
    expect(screen.getByText('Rotate Keys')).toBeDefined();
  });

  it('allows quick switching between hackathon demo personas', async () => {
    function SwitcherComponent() {
      const { user, switchDemoPersona } = useAuth();
      return (
        <div>
          <span data-testid="user-name">{user?.fullName}</span>
          <span data-testid="user-role">{user?.role}</span>
          <button onClick={() => switchDemoPersona('user-demo-sarah')}>Switch Sarah</button>
        </div>
      );
    }

    render(
      <TestWrapper>
        <SwitcherComponent />
      </TestWrapper>
    );

    expect(screen.getByTestId('user-name').textContent).toBe('Alex Morgan');
    
    await act(async () => {
      fireEvent.click(screen.getByText('Switch Sarah'));
    });

    expect(screen.getByTestId('user-name').textContent).toBe('Sarah Connor');
    expect(screen.getByTestId('user-role').textContent).toBe('DevOps Lead');
  });
});
