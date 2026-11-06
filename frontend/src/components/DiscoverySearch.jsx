import React, { useState } from 'react';
import { Search, ShieldCheck, ShieldAlert, Sparkles, Filter, Check, ArrowRight, Zap, Info, Plus, CheckCircle2, SlidersHorizontal, Scale } from 'lucide-react';
import RiskMeter from './RiskMeter';

const CATALOG_ITEMS = [
  {
    product_id: 'prod_pinecone_01',
    product_name: 'Pinecone Serverless',
    vendor_domain: 'pinecone.io',
    category: 'Vector Databases & AI',
    features: 'High-performance managed vector database with serverless indexing, low-latency search, and metadata filtering.',
    pricing_tier: 'Serverless Developer',
    monthly_cost: 25.0,
    soc2_compliant: true,
    tos_risk_score: 0.12,
    dark_pattern_warnings: []
  },
  {
    product_id: 'prod_weaviate_02',
    product_name: 'Weaviate Cloud',
    vendor_domain: 'weaviate.io',
    category: 'Vector Databases & AI',
    features: 'Open-source hybrid search engine with integrated multi-modal embeddings and sub-millisecond retrieval.',
    pricing_tier: 'Standard Cloud',
    monthly_cost: 45.0,
    soc2_compliant: true,
    tos_risk_score: 0.18,
    dark_pattern_warnings: []
  },
  {
    product_id: 'prod_cursor_03',
    product_name: 'Cursor Pro',
    vendor_domain: 'cursor.sh',
    category: 'Developer Tools',
    features: 'AI-first code editor powered by Anthropic & OpenAI frontier models with multi-file edits and terminal intelligence.',
    pricing_tier: 'Pro Individual',
    monthly_cost: 20.0,
    soc2_compliant: true,
    tos_risk_score: 0.15,
    dark_pattern_warnings: []
  },
  {
    product_id: 'prod_supabase_04',
    product_name: 'Supabase Pro',
    vendor_domain: 'supabase.com',
    category: 'Databases & Infrastructure',
    features: 'Dedicated PostgreSQL database with pgvector, real-time change data capture, automated backups, and Auth.',
    pricing_tier: 'Pro Tier',
    monthly_cost: 25.0,
    soc2_compliant: true,
    tos_risk_score: 0.10,
    dark_pattern_warnings: []
  },
  {
    product_id: 'prod_predatory_05',
    product_name: 'AutoLog Pro',
    vendor_domain: 'autolog-sys.dev',
    category: 'Observability & Monitoring',
    features: 'Full-stack distributed tracing and log parsing with a promotional 14-day free trial that automatically locks in.',
    pricing_tier: 'Pro Trial',
    monthly_cost: 49.0,
    soc2_compliant: false,
    tos_risk_score: 0.85,
    dark_pattern_warnings: [
      'Mandatory phone call during US EST business hours required for cancellation',
      'Auto-converts to $588/yr without advance email reminder'
    ]
  },
  {
    product_id: 'prod_datadog_06',
    product_name: 'DataDog APM Essentials',
    vendor_domain: 'datadoghq.com',
    category: 'Observability & Monitoring',
    features: 'End-to-end distributed tracing, infrastructure telemetry metrics, and proactive synthetic uptime monitors.',
    pricing_tier: 'Pro Infra',
    monthly_cost: 31.0,
    soc2_compliant: true,
    tos_risk_score: 0.42,
    dark_pattern_warnings: [
      'Overage charges billed at $1.50 per additional host-hour without hard ceiling'
    ]
  }
];

const SUGGESTED_QUERIES = [
  'SOC-2 vector databases under $50/mo',
  'AI coding assistants',
  'Predictable database pricing',
  'Observability without cancellation traps'
];

const CATEGORIES = [
  'All Categories',
  'Vector Databases & AI',
  'Developer Tools',
  'Databases & Infrastructure',
  'Observability & Monitoring'
];

export default function DiscoverySearch({ onSelectTool, compareList = [], onToggleCompare }) {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [maxBudget, setMaxBudget] = useState(50);
  const [soc2Only, setSoc2Only] = useState(true);
  const [provisioningId, setProvisioningId] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const filteredTools = CATALOG_ITEMS.filter((tool) => {
    const categoryOk = selectedCategory === 'All Categories' || tool.category === selectedCategory;
    const budgetOk = Number(tool.monthly_cost) <= Number(maxBudget);
    const soc2Ok = !soc2Only || tool.soc2_compliant;
    const textOk = !query.trim() ||
      tool.product_name.toLowerCase().includes(query.toLowerCase()) ||
      tool.features.toLowerCase().includes(query.toLowerCase()) ||
      tool.category.toLowerCase().includes(query.toLowerCase()) ||
      tool.vendor_domain.toLowerCase().includes(query.toLowerCase());
    return categoryOk && budgetOk && soc2Ok && textOk;
  });

  const handleProvisionClick = (tool) => {
    setProvisioningId(tool.product_id);
    setTimeout(() => {
      if (onSelectTool) onSelectTool(tool);
      setProvisioningId(null);
    }, 450);
  };

  const isCompared = (toolId) => compareList.some(item => item.product_id === toolId);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Marketplace Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #17243D 0%, #293A55 100%)',
          borderRadius: '16px',
          padding: '28px 32px',
          color: '#ffffff',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 8px 24px rgba(23, 36, 61, 0.12)'
        }}
      >
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '720px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', backgroundColor: 'rgba(69, 104, 245, 0.25)', border: '1px solid rgba(69, 104, 245, 0.4)', padding: '4px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: 600, color: '#A5B7F9', marginBottom: '12px' }}>
            <Sparkles size={13} />
            <span>SubGuard Intelligent SaaS Marketplace</span>
          </div>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '26px', fontWeight: 700, letterSpacing: '-0.02em', color: '#ffffff' }}>
            Shop for software intelligently. Stay protected automatically.
          </h1>
          <p style={{ margin: 0, fontSize: '13px', color: '#B6C4DB', lineHeight: 1.5 }}>
            Evaluate verified SaaS vendors with real-time SOC-2 verification, contract dark-pattern risk inspection, and pre-armed cancellation guardrails before you subscribe.
          </p>
        </div>

        {/* Decorative badge */}
        <div
          style={{
            position: 'absolute',
            right: '28px',
            bottom: '24px',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '10px',
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          <Zap size={18} color="#22B982" />
          <div style={{ fontSize: '11px', lineHeight: 1.3 }}>
            <div style={{ fontWeight: 600, color: '#ffffff' }}>Autonomous Spending Cap</div>
            <div style={{ color: '#B6C4DB' }}>$50.00 / month limit enforced</div>
          </div>
        </div>
      </div>

      {/* Search & Filter Command Panel */}
      <div className="glass-panel" style={{ padding: '20px 24px' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Natural Language Search Input */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <div style={{ position: 'absolute', left: '16px', color: '#4568F5', display: 'flex', alignItems: 'center' }}>
              <Search size={18} />
            </div>

            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by capability, tool name, or requirement (e.g. 'vector database with serverless pricing')..."
              style={{
                width: '100%',
                padding: '14px 100px 14px 46px',
                backgroundColor: '#FAFBFC',
                border: '1.5px solid #D0D9E7',
                borderRadius: '10px',
                fontSize: '13px',
                color: '#17243D',
                fontWeight: 500,
                outline: 'none',
                transition: 'all 0.15s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = '#4568F5'}
              onBlur={(e) => e.target.style.borderColor = '#D0D9E7'}
            />

            <div style={{ position: 'absolute', right: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  style={{ border: 'none', background: 'transparent', fontSize: '11px', color: '#687F9E', cursor: 'pointer', padding: '2px 6px' }}
                >
                  Clear
                </button>
              )}
              <kbd style={{ fontSize: '11px', fontWeight: 600, color: '#687F9E', backgroundColor: '#F0F3F8', border: '1px solid #D0D9E7', borderRadius: '5px', padding: '3px 7px' }}>
                ⌘K
              </kbd>
            </div>
          </div>

          {/* Suggested Query Chips */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#687F9E', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Suggested:
            </span>
            {SUGGESTED_QUERIES.map((sq, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setQuery(sq)}
                style={{
                  border: '1px solid #E1E8F0',
                  backgroundColor: query === sq ? '#EFF3FE' : '#ffffff',
                  color: query === sq ? '#4568F5' : '#293A55',
                  padding: '4px 11px',
                  borderRadius: '100px',
                  fontSize: '11px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {sq}
              </button>
            ))}
          </div>

          {/* Category Tabs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflowX: 'auto', paddingBottom: '4px', borderBottom: '1px solid #F0F3F8' }}>
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    border: 'none',
                    backgroundColor: isSelected ? '#17243D' : 'transparent',
                    color: isSelected ? '#ffffff' : '#4C607C',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: isSelected ? 600 : 500,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Filter Bar */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {/* Max Monthly Cap Filter */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#293A55' }}>Monthly Price Ceiling:</span>
                <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#F0F3F8', border: '1px solid #D0D9E7', borderRadius: '6px', padding: '3px 8px' }}>
                  <span style={{ fontSize: '12px', color: '#687F9E', marginRight: '2px', fontWeight: 600 }}>$</span>
                  <input
                    type="number"
                    min="5"
                    max="200"
                    value={maxBudget}
                    onChange={(e) => setMaxBudget(Number(e.target.value))}
                    style={{
                      width: '45px',
                      border: 'none',
                      backgroundColor: 'transparent',
                      fontSize: '12px',
                      fontWeight: 700,
                      color: '#17243D',
                      outline: 'none',
                      fontVariantNumeric: 'tabular-nums'
                    }}
                  />
                  <span style={{ fontSize: '10px', color: '#687F9E', marginLeft: '2px' }}>/mo</span>
                </div>
              </div>

              {/* SOC-2 Toggle */}
              <label
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: soc2Only ? '#4568F5' : '#687F9E',
                  backgroundColor: soc2Only ? '#EFF3FE' : '#FAFBFC',
                  border: `1.5px solid ${soc2Only ? '#BCCCFB' : '#D0D9E7'}`,
                  padding: '5px 12px',
                  borderRadius: '6px',
                  transition: 'all 0.15s ease'
                }}
              >
                <input
                  type="checkbox"
                  checked={soc2Only}
                  onChange={(e) => setSoc2Only(e.target.checked)}
                  style={{ display: 'none' }}
                />
                <ShieldCheck size={14} color={soc2Only ? '#4568F5' : '#687F9E'} />
                <span>SOC-2 Certified Only</span>
              </label>
            </div>

            <div style={{ fontSize: '12px', color: '#687F9E' }}>
              Showing <strong>{filteredTools.length}</strong> verified SaaS products
            </div>
          </div>
        </form>
      </div>

      {/* Product Cards Marketplace Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))', gap: '20px' }}>
        {filteredTools.map((tool) => {
          const isProvisioning = provisioningId === tool.product_id;
          const isPredatory = tool.tos_risk_score > 0.6;
          const initial = tool.product_name.charAt(0);
          const compared = isCompared(tool.product_id);

          return (
            <div
              key={tool.product_id}
              className="product-card"
              style={{
                borderColor: compared ? '#4568F5' : (isPredatory ? '#FCDAD7' : '#E1E8F0'),
                boxShadow: compared ? '0 4px 16px rgba(69, 104, 245, 0.12)' : undefined,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                {/* Header & Identity */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '10px',
                        backgroundColor: '#F0F3F8',
                        border: '1px solid #D0D9E7',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '15px',
                        fontWeight: 700,
                        color: '#17243D',
                        flexShrink: 0
                      }}
                    >
                      {initial}
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#17243D', letterSpacing: '-0.01em' }}>
                        {tool.product_name}
                      </h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                        <span style={{ fontSize: '11px', color: '#687F9E' }}>{tool.vendor_domain}</span>
                        <span style={{ fontSize: '10px', color: '#D0D9E7' }}>•</span>
                        <span style={{ fontSize: '10px', color: '#4C607C', backgroundColor: '#F0F3F8', padding: '1px 6px', borderRadius: '4px', fontWeight: 500 }}>
                          {tool.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing Box */}
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: '#17243D', fontVariantNumeric: 'tabular-nums' }}>
                      ${tool.monthly_cost.toFixed(2)}
                    </div>
                    <div style={{ fontSize: '10px', color: '#687F9E' }}>/ month</div>
                  </div>
                </div>

                {/* Features Description */}
                <p style={{ margin: '14px 0 12px 0', fontSize: '12px', color: '#293A55', lineHeight: 1.5 }}>
                  {tool.features}
                </p>

                {/* Badges: Tier & SOC-2 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: '#4C607C', backgroundColor: '#F0F3F8', padding: '2px 8px', borderRadius: '4px' }}>
                    {tool.pricing_tier}
                  </span>
                  {tool.soc2_compliant ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 600, color: '#188A60', backgroundColor: '#E4F8F1', padding: '2px 8px', borderRadius: '4px' }}>
                      <ShieldCheck size={12} /> SOC-2 Type II
                    </span>
                  ) : (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 500, color: '#B5741B', backgroundColor: '#FCF3E5', padding: '2px 8px', borderRadius: '4px' }}>
                      SOC-2 Pending
                    </span>
                  )}
                </div>

                {/* Dark Pattern Contract Warnings (if any) */}
                {tool.dark_pattern_warnings && tool.dark_pattern_warnings.length > 0 && (
                  <div style={{ backgroundColor: '#FCEDED', border: '1px solid #FCDAD7', borderRadius: '8px', padding: '10px 12px', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700, color: '#B42833', marginBottom: '4px' }}>
                      <ShieldAlert size={13} /> Contractual Risk Warning
                    </div>
                    {tool.dark_pattern_warnings.map((w, idx) => (
                      <div key={idx} style={{ fontSize: '11px', color: '#D9535D', lineHeight: 1.4 }}>
                        • {w}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Card Footer: ToS Risk Score + Actions */}
              <div style={{ borderTop: '1px solid #F0F3F8', paddingTop: '14px', marginTop: '6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                <div style={{ flex: 1 }}>
                  <RiskMeter score={tool.tos_risk_score} />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {/* Shortlist / Compare Toggle */}
                  {onToggleCompare && (
                    <button
                      type="button"
                      onClick={() => onToggleCompare(tool)}
                      title={compared ? 'Remove from comparison shortlist' : 'Add to comparison shortlist'}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '32px',
                        height: '32px',
                        borderRadius: '7px',
                        border: `1.5px solid ${compared ? '#4568F5' : '#D0D9E7'}`,
                        backgroundColor: compared ? '#EFF3FE' : '#ffffff',
                        color: compared ? '#4568F5' : '#4C607C',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <Scale size={14} />
                    </button>
                  )}

                  {/* Provision Button */}
                  <button
                    type="button"
                    onClick={() => handleProvisionClick(tool)}
                    disabled={isProvisioning}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      border: 'none',
                      backgroundColor: isPredatory ? '#D9535D' : '#17243D',
                      color: '#ffffff',
                      borderRadius: '7px',
                      padding: '8px 14px',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: isProvisioning ? 'wait' : 'pointer',
                      transition: 'opacity 0.15s ease',
                      boxShadow: '0 1px 3px rgba(23, 36, 61, 0.1)'
                    }}
                  >
                    {isProvisioning ? (
                      <span>Arming...</span>
                    ) : (
                      <>
                        <span>Provision</span>
                        <ArrowRight size={13} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
