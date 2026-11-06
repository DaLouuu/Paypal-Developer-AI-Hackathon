import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import SubscriptionTable from '../components/SubscriptionTable';

const mockSubscriptions = [
  {
    id: 'sub_01',
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
    id: 'sub_02',
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
    id: 'sub_03',
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

describe('SubscriptionTable Component', () => {
  it('renders the subscription table container and table component', () => {
    render(<SubscriptionTable subscriptions={mockSubscriptions} />);
    expect(screen.getByTestId('subscription-table-container')).toBeInTheDocument();
    expect(screen.getByTestId('subscription-table')).toBeInTheDocument();
  });

  it('correctly calculates and displays the total monthly burn rate', () => {
    render(<SubscriptionTable subscriptions={mockSubscriptions} />);
    // Total = 80 + 80 + 75 = 235.00
    const totalBurnElement = screen.getByTestId('total-burn');
    expect(totalBurnElement).toHaveTextContent('$235.00');
  });

  it('correctly displays active subscription count', () => {
    render(<SubscriptionTable subscriptions={mockSubscriptions} />);
    // Active = Notion (ACTIVE_RECURRING) + Cursor (TRIAL_ACTIVE) = 2
    const activeCountElement = screen.getByTestId('active-count');
    expect(activeCountElement).toHaveTextContent('2');
  });
});

