import React, { useState } from 'react';
import { Search, ShieldCheck, AlertTriangle, ArrowRight } from 'lucide-react';

export default function DiscoverySearch({ onSelectTool }) {
  const [query, setQuery] = useState('');
  const [maxBudget, setMaxBudget] = useState(50);
  const [soc2Only, setSoc2Only] = useState(true);
  const [results, setResults] = useState([
    {
      product_id: 'prod_pinecone_01',
      product_name: 'Pinecone Serverless',
      vendor_domain: 'pinecone.io',
      category: 'Vector Database',
      features: 'High-performance managed vector database with serverless pricing',
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
      features: 'Open-source hybrid search with integrated multi-modal embeddings',
      pricing_tier: 'Standard Cloud',
      monthly_cost: 45.0,
      soc2_compliant: true,
      tos_risk_score: 0.18,
      dark_pattern_warnings: []
    }
  ]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Filters mock catalog based on input
    const filtered = results.filter(item => {
      const budgetOk = Number(item.monthly_cost) <= Number(maxBudget);
      const soc2Ok = !soc2Only || item.soc2_compliant;
      const textOk = !query || item.product_name.toLowerCase().includes(query.toLowerCase()) || item.features.toLowerCase().includes(query.toLowerCase());
      return budgetOk && soc2Ok && textOk;
    });
    setResults(filtered.length ? filtered : results);
  };

  return (
    <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
        <Search size={18} color="#2563eb" />
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#0f172a' }}>
          Semantic SaaS Discovery & ToS Risk Radar
        </h3>
      </div>

      <form onSubmit={handleSearch} style={{ display: 'grid', gridTemplateColumns: '1fr 140px 140px 100px', gap: '12px', alignItems: 'center' }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Natural-language search e.g. 'SOC-2 vector database under $50/mo'..."
          style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '12px', color: '#64748b' }}>Max:</span>
          <input
            type="number"
            value={maxBudget}
            onChange={(e) => setMaxBudget(Number(e.target.value))}
            style={{ width: '80px', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
          />
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#334155', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={soc2Only}
            onChange={(e) => setSoc2Only(e.target.checked)}
          />
          SOC-2 Only
        </label>

        <button
          type="submit"
          style={{ backgroundColor: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '10px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
        >
          Search
        </button>
      </form>

      {/* Discovery Result Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '14px', marginTop: '16px' }}>
        {results.map((tool) => (
          <div
            key={tool.product_id}
            style={{
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '14px',
              backgroundColor: '#f8fafc',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600, fontSize: '14px', color: '#0f172a' }}>{tool.product_name}</span>
                <span style={{ fontWeight: 700, fontSize: '14px', color: '#2563eb' }}>${tool.monthly_cost.toFixed(2)}/mo</span>
              </div>
              <p style={{ fontSize: '12px', color: '#64748b', marginTop: '6px', marginBottom: '10px' }}>{tool.features}</p>
            </div>

            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#16a34a' }}>
                <ShieldCheck size={14} /> ToS Risk: {(tool.tos_risk_score * 100).toFixed(0)}%
              </div>

              <button
                onClick={() => onSelectTool && onSelectTool(tool)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  backgroundColor: '#0f172a',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '6px 12px',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Provision <ArrowRight size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
