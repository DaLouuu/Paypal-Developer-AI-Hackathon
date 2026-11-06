import React, { useState, useMemo, useRef, useEffect } from 'react';
import SubGuardIcon from './SubGuardIcon';

const CURATED_PRODUCTS = [
  {
    product_id: 'prod_notion',
    name: 'Notion',
    mark: 'N',
    color: '#161616',
    bg: '#f1f1ef',
    category: 'Productivity',
    line: 'One calm place for your team to think, write, and plan.',
    price: 10,
    rating: '4.8',
    risk: 'Low risk',
    tag: 'Best for teams',
    pricing_tier: 'Team Plus',
    vendor_domain: 'notion.so',
    soc2_compliant: true,
    tos_risk_score: 0.12
  },
  {
    product_id: 'prod_figma',
    name: 'Figma',
    mark: 'F',
    color: '#ff5f57',
    bg: '#fff0ec',
    category: 'Design',
    line: 'Design, prototype, and bring your best ideas to life.',
    price: 15,
    rating: '4.9',
    risk: 'Low risk',
    tag: 'Popular',
    pricing_tier: 'Professional',
    vendor_domain: 'figma.com',
    soc2_compliant: true,
    tos_risk_score: 0.14
  },
  {
    product_id: 'prod_cursor',
    name: 'Cursor',
    mark: 'C',
    color: '#7667f6',
    bg: '#f0edff',
    category: 'Development',
    line: 'The AI code editor built to help you move faster.',
    price: 20,
    rating: '4.7',
    risk: 'Medium risk',
    tag: 'AI pick',
    pricing_tier: 'Pro Individual',
    vendor_domain: 'cursor.sh',
    soc2_compliant: true,
    tos_risk_score: 0.82
  },
  {
    product_id: 'prod_slack',
    name: 'Slack',
    mark: 'S',
    color: '#2eb67d',
    bg: '#eaf9f3',
    category: 'Communication',
    line: 'A smarter, simpler way to keep your team in sync.',
    price: 8.75,
    rating: '4.8',
    risk: 'Low risk',
    tag: 'Great value',
    pricing_tier: 'Pro',
    vendor_domain: 'slack.com',
    soc2_compliant: true,
    tos_risk_score: 0.15
  },
  {
    product_id: 'prod_pinecone',
    name: 'Pinecone',
    mark: 'P',
    color: '#0052cc',
    bg: '#e6f0ff',
    category: 'Development',
    line: 'Managed vector database with serverless indexing and sub-millisecond retrieval.',
    price: 25,
    rating: '4.8',
    risk: 'Low risk',
    tag: 'SOC-2 Type II',
    pricing_tier: 'Serverless Developer',
    vendor_domain: 'pinecone.io',
    soc2_compliant: true,
    tos_risk_score: 0.12
  },
  {
    product_id: 'prod_datadog',
    name: 'Datadog',
    mark: 'D',
    color: '#6320ee',
    bg: '#f3eeff',
    category: 'Development',
    line: 'End-to-end distributed tracing, infrastructure telemetry, and synthetic monitors.',
    price: 31,
    rating: '4.6',
    risk: 'Medium risk',
    tag: 'Observability',
    pricing_tier: 'Pro Infra',
    vendor_domain: 'datadoghq.com',
    soc2_compliant: true,
    tos_risk_score: 0.42
  }
];

const CATEGORIES = ['For you', 'Productivity', 'Design', 'Development', 'Communication'];

export default function DiscoverySearch({ onSelectTool }) {
  const [category, setCategory] = useState('For you');
  const [query, setQuery] = useState('');
  const [provisioningId, setProvisioningId] = useState(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleShortcut = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
        document.querySelector('#discover')?.scrollIntoView({ behavior: 'smooth' });
      }
    };
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, []);

  const filtered = useMemo(() => {
    return CURATED_PRODUCTS.filter((product) => {
      const matchesCategory = category === 'For you' || product.category === category;
      const haystack = `${product.name} ${product.category} ${product.line}`.toLowerCase();
      return matchesCategory && haystack.includes(query.toLowerCase());
    });
  }, [category, query]);

  const handleCardClick = (product) => {
    setProvisioningId(product.product_id);
    setTimeout(() => {
      if (onSelectTool) {
        onSelectTool({
          product_id: product.product_id,
          product_name: product.name,
          pricing_tier: product.pricing_tier,
          monthly_cost: product.price,
          vendor_domain: product.vendor_domain,
          tos_risk_score: product.tos_risk_score,
          category: product.category
        });
      }
      setProvisioningId(null);
    }, 350);
  };

  return (
    <section className="marketplace-section" id="discover">
      {/* Section Header */}
      <div className="section-heading">
        <div>
          <span className="section-kicker">THE SUBGUARD EDIT</span>
          <h2>Software worth paying for.</h2>
          <p>Handpicked tools with clear pricing, verified security, and no nasty renewal surprises.</p>
        </div>
        <a href="#discover">
          Browse all software <SubGuardIcon name="arrow" size={17} />
        </a>
      </div>

      {/* Toolbar: Categories & Search Bar */}
      <div className="market-toolbar">
        <div className="categories" role="tablist" aria-label="Software categories">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              role="tab"
              aria-selected={category === cat}
              className={category === cat ? 'active' : ''}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <label className="search-box">
          <SubGuardIcon name="search" size={18} />
          <input
            ref={searchRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Try “a design tool under $20”'
            aria-label="Search the software marketplace"
          />
          {query && (
            <button
              className="search-clear"
              onClick={() => setQuery('')}
              aria-label="Clear search"
              type="button"
            >
              ×
            </button>
          )}
          <span>⌘ K</span>
        </label>
      </div>

      {/* Result summary banner */}
      <div className="result-summary">
        <span>
          <SubGuardIcon name="shield" size={13} /> Every result is contract-checked by SubGuard
        </span>
        <small>{filtered.length} curated matches</small>
      </div>

      {/* Product Cards Grid */}
      <div className="product-grid">
        {filtered.map((product) => {
          const isProvisioning = provisioningId === product.product_id;
          return (
            <article key={product.product_id} className="product-card">
              <div className="product-topline">
                <span className="product-tag">{product.tag}</span>
                <button
                  className="icon-button"
                  aria-label={`More options for ${product.name}`}
                  type="button"
                >
                  <SubGuardIcon name="more" />
                </button>
              </div>

              <div className="product-identity">
                <span className="product-logo" style={{ background: product.bg, color: product.color }}>
                  {product.mark}
                </span>
                <div>
                  <h3>{product.name}</h3>
                  <span>{product.category}</span>
                </div>
              </div>

              <p>{product.line}</p>

              <div className="trust-row">
                <span>
                  <SubGuardIcon name="shield" size={14} /> {product.risk}
                </span>
                <span className="guard-score">SG {product.rating}</span>
              </div>

              <div className="product-footer">
                <div>
                  <strong>${product.price}</strong>
                  <span> / user / mo</span>
                </div>
                <button
                  onClick={() => handleCardClick(product)}
                  aria-label={`Provision ${product.name}`}
                  title="Provision subscription"
                  type="button"
                >
                  {isProvisioning ? (
                    <SubGuardIcon name="check" size={16} />
                  ) : (
                    <SubGuardIcon name="arrow" size={17} />
                  )}
                </button>
              </div>
            </article>
          );
        })}

        {filtered.length === 0 && (
          <div className="empty-state">
            <SubGuardIcon name="search" size={24} />
            <strong>No matches yet</strong>
            <span>Try another name or category.</span>
          </div>
        )}
      </div>
    </section>
  );
}
