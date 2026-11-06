import React, { useState } from 'react';
import { Search, ShieldCheck, ShieldAlert, Sparkles, Filter, Check, ArrowRight, Zap, Info } from 'lucide-react';
import RiskMeter from './RiskMeter';

export default function DiscoverySearch({ onSelectTool }) {
  const [query, setQuery] = useState('');
  const [maxBudget, setMaxBudget] = useState(50);
  const [soc2Only, setSoc2Only] = useState(true);
  const [provisioningId, setProvisioningId] = useState(null);

  const [catalog, setCatalog] = useState([
    {
      product_id: 'prod_pinecone_01',
      product_name: 'Pinecone Serverless',
      vendor_domain: 'pinecone.io',
      category: 'Vector Database',
      features: 'High-performance managed vector database with serverless indexing and metadata filtering.',
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
      category: 'Vector Database',
      features: 'Open-source hybrid search engine with integrated multi-modal embeddings and sub-millisecond retrieval.',
      pricing_tier: 'Standard Cloud',
      monthly_cost: 45.0,
      soc2_compliant: true,
      tos_risk_score: 0.18,
      dark_pattern_warnings: []
    },
    {
      product_id: 'prod_predatory_03',
      product_name: 'AutoLog Pro',
      vendor_domain: 'autolog-sys.dev',
      category: 'Observability',
      features: 'Full-stack distributed tracing and log parsing with promotional 14-day free trial.',
      pricing_tier: 'Pro Trial',
      monthly_cost: 49.0,
      soc2_compliant: false,
      tos_risk_score: 0.85,
      dark_pattern_warnings: [
        'Mandatory telephone call required for cancellation',
        'Auto-converts to $588/yr without advance email reminder'
      ]
    }
  ]);

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const filteredTools = catalog.filter((tool) => {
    const budgetOk = Number(tool.monthly_cost) <= Number(maxBudget);
    const soc2Ok = !soc2Only || tool.soc2_compliant;
    const textOk = !query.trim() ||
      tool.product_name.toLowerCase().includes(query.toLowerCase()) ||
      tool.features.toLowerCase().includes(query.toLowerCase()) ||
      tool.category.toLowerCase().includes(query.toLowerCase());
    return budgetOk && soc2Ok && textOk;
  });

  const handleProvisionClick = (tool) => {
    setProvisioningId(tool.product_id);
    setTimeout(() => {
      if (onSelectTool) onSelectTool(tool);
      setProvisioningId(null);
    }, 400);
  };

  return (
    <div className="glass-panel" style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ display: 'inline-flex', padding: '4px', borderRadius: '6px', backgroundColor: '#eff6ff', color: '#2563eb' }}>
              <Sparkles size={16} />
            </span>
            <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.01em' }}>
              Semantic SaaS Discovery & ToS Risk Radar
            </h2>
          </div>
          <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#64748b' }}>
            Natural-language vector RAG search with contractual dark-pattern inspection and automated spending guardrails.
          </p>
        </div>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#64748b', backgroundColor: '#f1f5f9', padding: '4px 8px', borderRadius: '6px' }}>
          <Zap size={13} color="#2563eb" />
          <span>Elasticsearch 8.x k-NN Active</span>
        </div>
      </div>

      {/* Command Palette Search Box */}
      <form onSubmit={handleSearch} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <div style={{ position: 'absolute', left: '14px', color: '#94a3b8', display: 'flex', alignItems: 'center' }}>
            <Search size={16} />
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Describe what your agent or team needs (e.g. 'Find SOC-2 compliant vector databases under $50/month')..."
            style={{
              width: '100%',
              padding: '12px 90px 12px 42px',
              backgroundColor: '#f8fafc',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              fontSize: '13px',
              color: '#0f172a',
              outline: 'none',
              transition: 'border-color 0.15s ease, box-shadow 0.15s ease'
            }}
          />

          <div style={{ position: 'absolute', right: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <kbd style={{ fontSize: '10px', fontWeight: 600, color: '#94a3b8', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '2px 5px', boxShadow: '0 1px 1px rgba(0,0,0,0.05)' }}>
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Filter Bar */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px', paddingTop: '2px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Monthly Budget Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 500, color: '#475569' }}>Max Monthly Cap:</span>
              <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '2px 8px' }}>
                <span style={{ fontSize: '12px', color: '#64748b', marginRight: '2px' }}>$</span>
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
                    fontWeight: 600,
                    color: '#0f172a',
                    outline: 'none',
                    fontVariantNumeric: 'tabular-nums'
                  }}
                />
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
                fontWeight: 500,
                color: soc2Only ? '#1e40af' : '#64748b',
                backgroundColor: soc2Only ? '#eff6ff' : '#f8fafc',
                border: `1px solid ${soc2Only ? '#bfdbfe' : '#e2e8f0'}`,
                padding: '4px 10px',
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
              <ShieldCheck size={14} color={soc2Only ? '#2563eb' : '#94a3b8'} />
              <span>SOC-2 Certified Only</span>
            </label>
          </div>

          <div style={{ fontSize: '11px', color: '#94a3b8' }}>
            Showing <strong>{filteredTools.length}</strong> matching verified vendors
          </div>
        </div>
      </form>

      {/* Discovery Tool Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px', marginTop: '20px' }}>
        {filteredTools.map((tool) => {
          const isProvisioning = provisioningId === tool.product_id;
          const isPredatory = tool.tos_risk_score > 0.6;

          return (
            <div
              key={tool.product_id}
              style={{
                backgroundColor: '#ffffff',
                border: `1px solid ${isPredatory ? '#fecaca' : '#e2e8f0'}`,
                borderRadius: '10px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: isPredatory ? '0 1px 3px rgba(239, 68, 68, 0.08)' : '0 1px 2px rgba(15, 23, 42, 0.04)',
                transition: 'border-color 0.15s ease, box-shadow 0.15s ease'
              }}
            >
              <div>
                {/* Card Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>{tool.product_name}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>{tool.vendor_domain}</span>
                      <span style={{ fontSize: '11px', color: '#cbd5e1' }}>•</span>
                      <span style={{ fontSize: '11px', color: '#64748b', backgroundColor: '#f1f5f9', padding: '1px 6px', borderRadius: '4px' }}>
                        {tool.category}
                      </span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', fontVariantNumeric: 'tabular-nums' }}>
                      ${tool.monthly_cost.toFixed(2)}
                    </div>
                    <div style={{ fontSize: '10px', color: '#94a3b8' }}>/ month</div>
                  </div>
                </div>

                {/* Description */}
                <p style={{ margin: '12px 0', fontSize: '12px', color: '#475569', lineHeight: 1.5 }}>
                  {tool.features}
                </p>

                {/* Dark Pattern Warnings (if any) */}
                {tool.dark_pattern_warnings && tool.dark_pattern_warnings.length > 0 && (
                  <div style={{ backgroundColor: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '6px', padding: '8px 10px', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', fontWeight: 600, color: '#9f1239', marginBottom: '4px' }}>
                      <ShieldAlert size={13} /> Contractual Risk Warning
                    </div>
                    {tool.dark_pattern_warnings.map((w, idx) => (
                      <div key={idx} style={{ fontSize: '11px', color: '#be123c', lineHeight: 1.4, paddingLeft: '4px' }}>
                        • {w}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Card Footer: ToS Risk Meter & Action Button */}
              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '12px', marginTop: '6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <RiskMeter score={tool.tos_risk_score} />
                </div>

                <button
                  type="button"
                  onClick={() => handleProvisionClick(tool)}
                  disabled={isProvisioning}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    border: 'none',
                    backgroundColor: isPredatory ? '#f43f5e' : '#0f172a',
                    color: '#ffffff',
                    borderRadius: '6px',
                    padding: '7px 13px',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: isProvisioning ? 'wait' : 'pointer',
                    transition: 'opacity 0.15s ease',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                  }}
                >
                  {isProvisioning ? (
                    <span>Arming...</span>
                  ) : (
                    <>
                      <span>Provision</span>
                      <ArrowRight size={12} />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
