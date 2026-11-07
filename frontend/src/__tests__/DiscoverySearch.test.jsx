import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DiscoverySearch from '../components/DiscoverySearch';
import { AuthProvider } from '../context/AuthContext';

function TestWrapper({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}

describe('DiscoverySearch & Beta Catalog UI', () => {
  it('renders curated software products and category tabs', () => {
    const handleSelect = vi.fn();
    render(
      <TestWrapper>
        <DiscoverySearch onSelectTool={handleSelect} />
      </TestWrapper>
    );

    expect(screen.getByText('Notion')).toBeDefined();
    expect(screen.getByText('Cursor')).toBeDefined();
    expect(screen.getByText('Figma')).toBeDefined();
    expect(screen.getByRole('tab', { name: 'For you' })).toBeDefined();
    expect(screen.getByRole('tab', { name: 'Development' })).toBeDefined();
  });

  it('filters tools when searching by query', () => {
    const handleSelect = vi.fn();
    render(
      <TestWrapper>
        <DiscoverySearch onSelectTool={handleSelect} />
      </TestWrapper>
    );

    const searchInput = screen.getByLabelText('Search the software marketplace');
    fireEvent.change(searchInput, { target: { value: 'Pinecone' } });

    expect(screen.getByText('Pinecone')).toBeDefined();
    expect(screen.queryByText('Figma')).toBeNull();
  });

  it('filters out non-SOC-2 tools when SOC-2 Only toggle is clicked', () => {
    const handleSelect = vi.fn();
    render(
      <TestWrapper>
        <DiscoverySearch onSelectTool={handleSelect} />
      </TestWrapper>
    );

    // Initial state: AutoLog Pro is present in curated list
    const categoryDev = screen.getByRole('tab', { name: 'Development' });
    fireEvent.click(categoryDev);
    expect(screen.getByText('AutoLog Pro')).toBeDefined();

    // Enable SOC-2 Only
    const soc2Toggle = screen.getByText('SOC-2 Only');
    fireEvent.click(soc2Toggle);

    // AutoLog Pro is not SOC-2 compliant, so it must be filtered out
    expect(screen.queryByText('AutoLog Pro')).toBeNull();
    // Cursor and Pinecone are SOC-2 compliant, so they remain
    expect(screen.getByText('Cursor')).toBeDefined();
    expect(screen.getByText('Pinecone')).toBeDefined();
  });

  it('opens product details modal on card click and displays ToS inspection details', () => {
    const handleSelect = vi.fn();
    render(
      <TestWrapper>
        <DiscoverySearch onSelectTool={handleSelect} />
      </TestWrapper>
    );

    // Click Cursor card
    const cursorCard = screen.getByText('Cursor').closest('article');
    fireEvent.click(cursorCard);

    expect(screen.getByText('Contract & Dark-Pattern Inspection')).toBeDefined();
    expect(screen.getByText('ToS Clause Warnings Detected:')).toBeDefined();
    expect(screen.getByText('Confirm & Provision')).toBeDefined();
  });

  it('adds and removes products from comparison drawer', () => {
    const handleSelect = vi.fn();
    render(
      <TestWrapper>
        <DiscoverySearch onSelectTool={handleSelect} />
      </TestWrapper>
    );

    // Click Compare on Notion
    const notionCompareBtn = screen.getByLabelText('Add Notion to comparison');
    fireEvent.click(notionCompareBtn);

    expect(screen.getByText(/Product Comparison & Shortlist \(1\/3\)/i)).toBeDefined();

    // Click Clear All
    const clearBtn = screen.getByText('Clear All');
    fireEvent.click(clearBtn);

    expect(screen.queryByText(/Product Comparison & Shortlist/i)).toBeNull();
  });
});
