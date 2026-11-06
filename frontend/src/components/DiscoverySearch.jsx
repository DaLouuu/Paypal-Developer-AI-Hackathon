import React, { useState, useMemo, useRef, useEffect } from 'react';
import SubGuardIcon from './SubGuardIcon';
import ProductDetailsModal from './ProductDetailsModal';

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
    tos_risk_score: 0.12,
    dark_pattern_warnings: []
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
    tos_risk_score: 0.14,
    dark_pattern_warnings: []
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
    tos_risk_score: 0.82,
    dark_pattern_warnings: [
      'Seven (7) days advance written notice required prior to trial expiration'
    ]
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
    tos_risk_score: 0.15,
    dark_pattern_warnings: []
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
    tos_risk_score: 0.12,
    dark_pattern_warnings: []
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
    tos_risk_score: 0.42,
    dark_pattern_warnings: []
  },
  {
    product_id: 'prod_autolog',
    name: 'AutoLog Pro',
    mark: 'A',
    color: '#d9535d',
    bg: '#fff0ef',
    category: 'Development',
    line: 'Distributed tracing with promotional trial that automatically converts to an annual contract.',
    price: 49,
    rating: '2.1',
    risk: 'High risk (Trapped)',
    tag: 'Contract Trap',
    pricing_tier: 'Pro Trial',
    vendor_domain: 'autolog-sys.dev',
    soc2_compliant: false,
    tos_risk_score: 0.88,
    dark_pattern_warnings: [
      'Mandatory phone call required for cancellation',
      'Auto-converts to $588/yr without advance email reminder',
      'Sixty (60) days advance notice required to prevent renewal'
    ]
  }
];

const CATEGORIES = ['For you', 'Productivity', 'Design', 'Development', 'Communication'];

const SUGGESTIONS = [
  'SOC-2 vector database under $50/mo',
  'AI coding assistants',
  'Predictable pricing without renewal traps'
];

export default function DiscoverySearch({ onSelectTool }) {
  const [category, setCategory] = useState('For you');
  const [query, setQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [soc2Only, setSoc2Only] = useState(false);
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
      const matchesSoc2 = !soc2Only || product.soc2_compliant;
      const haystack = `${product.name} ${product.category} ${product.line} ${product.tag}`.toLowerCase();
      return matchesCategory && matchesSoc2 && haystack.includes(query.toLowerCase());
    });
  }, [category, query, soc2Only]);

  const handleCardClick = (product) => {
    setSelectedProduct(product);
  };

  const handleConfirmProvision = (product) => {
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
      <div className="market-toolbar" style={{ flexDirection: 'column', gap: '14px', alignItems: 'stretch' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          {/* Categories Tablist */}
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

          {/* SOC-2 Toggle & Search Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <label
              className="soc2-pill"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
                color: soc2Only ? 'var(--blue)' : 'var(--muted)',
                background: soc2Only ? 'rgba(63, 100, 255, 0.1)' : 'transparent',
                border: '1px solid',
                borderColor: soc2Only ? 'var(--blue)' : 'var(--line)',
                padding: '8px 12px',
                borderRadius: '9px',
                transition: 'all 0.15s ease'
              }}
            >
              <input
                type="checkbox"
                checked={soc2Only}
                onChange={(e) => setSoc2Only(e.target.checked)}
                style={{ display: 'none' }}
              />
              <SubGuardIcon name="shield" size={13} />
              <span>SOC-2 Only</span>
            </label>

            <label className="search-box">
              <SubGuardIcon name="search" size={18} />
              <input
                ref={searchRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder='Try “vector database” or “coding”'
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
        </div>

        {/* Suggested Query Chips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', fontSize: '11px' }}>
          <span style={{ color: 'var(--muted)', fontWeight: 600 }}>Suggested:</span>
          {SUGGESTIONS.map((s, idx) => (
            <button
              key={idx}
              type="button"
              className="suggested-chip"
              onClick={() => setQuery(s)}
            >
              {s}
            </button>
          ))}
        </div>
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
        {filtered.map((product) => (
          <article
            key={product.product_id}
            className="product-card"
            onClick={() => handleCardClick(product)}
            style={{ cursor: 'pointer' }}
          >
            <div className="product-topline">
              <span className="product-tag">{product.tag}</span>
              <button
                className="icon-button"
                aria-label={`Inspect ${product.name}`}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCardClick(product);
                }}
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
              <span style={{ color: product.tos_risk_score > 0.6 ? '#c24e49' : undefined }}>
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
                onClick={(e) => {
                  e.stopPropagation();
                  handleCardClick(product);
                }}
                aria-label={`View details and provision ${product.name}`}
                title="Review & Provision"
                type="button"
              >
                <SubGuardIcon name="arrow" size={17} />
              </button>
            </div>
          </article>
        ))}

        {filtered.length === 0 && (
          <div className="empty-state">
            <SubGuardIcon name="search" size={24} />
            <strong>No matches found</strong>
            <span>Try another search term or click a suggested query above.</span>
          </div>
        )}
      </div>

      {/* Product Details & Provision Review Modal */}
      <ProductDetailsModal
        product={selectedProduct}
        isOpen={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
        onProvision={handleConfirmProvision}
      />
    </section>
  );
}
