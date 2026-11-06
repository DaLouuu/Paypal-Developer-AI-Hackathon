import React, { useState, useMemo, useRef, useEffect } from 'react';
import SubGuardIcon from './SubGuardIcon';
import ProductDetailsModal from './ProductDetailsModal';
import ProductCompareDrawer from './ProductCompareDrawer';

const CURATED_PRODUCTS = [
  {
    product_id: 'prod_notion',
    name: 'Notion',
    mark: 'N',
    color: '#060723',
    bg: '#ffffff',
    category: 'Productivity',
    line: 'One calm place for your team to think, write, and plan.',
    price: 10,
    original_price: 15,
    reviews_count: '24.1k',
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
    color: '#060723',
    bg: '#f9dec9',
    category: 'Design',
    line: 'Design, prototype, and bring your best ideas to life.',
    price: 15,
    original_price: 20,
    reviews_count: '18.4k',
    rating: '4.9',
    risk: 'Low risk',
    tag: 'Best Seller',
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
    color: '#ffffff',
    bg: '#216e65',
    category: 'Development',
    line: 'The AI code editor built to help you move faster.',
    price: 20,
    original_price: 28,
    reviews_count: '9.8k',
    rating: '4.7',
    risk: 'Medium risk',
    tag: 'Trending AI',
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
    color: '#060723',
    bg: '#2edcc4',
    category: 'Communication',
    line: 'A smarter, simpler way to keep your team in sync.',
    price: 8.75,
    original_price: 12.5,
    reviews_count: '31.2k',
    rating: '4.8',
    risk: 'Low risk',
    tag: 'Hot Deal',
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
    color: '#1b1f9d',
    bg: '#ffffff',
    category: 'Development',
    line: 'Managed vector database with serverless indexing and sub-millisecond retrieval.',
    price: 25,
    original_price: 35,
    reviews_count: '4.2k',
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
    color: '#1b1f9d',
    bg: '#ffffff',
    category: 'Development',
    line: 'End-to-end distributed tracing, infrastructure telemetry, and synthetic monitors.',
    price: 31,
    original_price: 40,
    reviews_count: '7.9k',
    rating: '4.6',
    risk: 'Medium risk',
    tag: 'Enterprise',
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
    color: '#ffffff',
    bg: '#060723',
    category: 'Development',
    line: 'Distributed tracing with promotional trial that automatically converts to an annual contract.',
    price: 49,
    original_price: 49,
    reviews_count: '320',
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
  const [favorites, setFavorites] = useState(['prod_notion', 'prod_figma']);
  const [compareList, setCompareList] = useState([]);
  const searchRef = useRef(null);

  const toggleFavorite = (productId, e) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const toggleCompare = (product, e) => {
    e.stopPropagation();
    setCompareList((prev) => {
      const exists = prev.some((p) => p.product_id === product.product_id);
      if (exists) {
        return prev.filter((p) => p.product_id !== product.product_id);
      }
      if (prev.length >= 3) {
        return [prev[1], prev[2], product];
      }
      return [...prev, product];
    });
  };

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
      {/* Amazon-Style High-Conversion Guarantee Banner */}
      <div className="ecommerce-promo-banner">
        <div className="promo-copy">
          <span className="promo-kicker">
            <SubGuardIcon name="sparkle" size={13} /> SUBGUARD EXCLUSIVE GUARANTEE
          </span>
          <h3>48-Hour Cancellation Shield on Every Subscription</h3>
          <p>
            Browse curated software provisioned through PayPal with deterministic spend limits. SubGuard intercepts checkout, checks contract terms, and auto-schedules rollover shields.
          </p>
          <div className="promo-perks">
            <span><SubGuardIcon name="check" size={13} /> Ed25519 Cryptographic Signatures</span>
            <span><SubGuardIcon name="check" size={13} /> 48h Autopilot Rollover Blocker</span>
            <span><SubGuardIcon name="check" size={13} /> $50.00 Autonomous Spend Ceiling</span>
          </div>
        </div>
        <div className="promo-badge-box">
          <div className="promo-badge-icon">
            <SubGuardIcon name="shield" size={38} stroke={2.4} />
          </div>
          <strong>100% Protected</strong>
          <small>PayPal Dev Sandbox</small>
        </div>
      </div>

      {/* Section Header */}
      <div className="section-heading">
        <div>
          <span className="section-kicker">THE SUBGUARD EDIT</span>
          <h2>Software worth paying for.</h2>
          <p>Handpicked tools with transparent pricing, verified compliance, and zero auto-renewal traps.</p>
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
                color: soc2Only ? '#2edcc4' : 'var(--muted)',
                background: soc2Only ? '#2edcc4' : 'transparent',
                border: '1px solid',
                borderColor: soc2Only ? '#2edcc4' : 'var(--line)',
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
        {filtered.map((product) => {
          const isFav = favorites.includes(product.product_id);
          const hasDiscount = product.original_price && product.original_price > product.price;

          return (
            <article
              key={product.product_id}
              className="product-card"
              onClick={() => handleCardClick(product)}
              style={{ cursor: 'pointer' }}
            >
              {/* Card Topline: Tag + Compare + Wishlist Heart */}
              <div className="product-topline">
                <span className="product-tag">{product.tag}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <button
                    className={`compare-btn ${compareList.some(p => p.product_id === product.product_id) ? 'active' : ''}`}
                    aria-label={compareList.some(p => p.product_id === product.product_id) ? `Remove ${product.name} from comparison` : `Add ${product.name} to comparison`}
                    type="button"
                    title={compareList.some(p => p.product_id === product.product_id) ? 'Comparing' : 'Compare tool'}
                    onClick={(e) => toggleCompare(product, e)}
                    style={{
                      background: compareList.some(p => p.product_id === product.product_id) ? 'var(--blue)' : 'transparent',
                      color: compareList.some(p => p.product_id === product.product_id) ? '#ffffff' : 'var(--muted)',
                      border: '1px solid var(--line)',
                      borderRadius: '8px',
                      padding: '3px 8px',
                      fontSize: '10px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <SubGuardIcon name="grid" size={11} /> {compareList.some(p => p.product_id === product.product_id) ? 'Comparing' : 'Compare'}
                  </button>
                  <button
                    className={`wishlist-btn ${isFav ? 'active' : ''}`}
                    aria-label={isFav ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
                    type="button"
                    title={isFav ? 'In your wishlist' : 'Save to wishlist'}
                    onClick={(e) => toggleFavorite(product.product_id, e)}
                  >
                    <SubGuardIcon name="heart" size={14} />
                  </button>
                </div>
              </div>

              {/* Product Identity */}
              <div className="product-identity">
                <span className="product-logo" style={{ background: product.bg, color: product.color }}>
                  {product.mark}
                </span>
                <div>
                  <h3>{product.name}</h3>
                  <span>{product.vendor_domain} · {product.category}</span>
                </div>
              </div>

              <p>{product.line}</p>

              {/* Star Rating E-commerce Row */}
              <div className="star-rating">
                <SubGuardIcon name="star" size={13} />
                <span>{product.rating}</span>
                <small>({product.reviews_count || '1.2k'} reviews)</small>
              </div>

              {/* Contract Risk & Trust Row */}
              <div className="trust-row">
                <span style={{ color: product.tos_risk_score > 0.6 ? '#f9dec9' : undefined }}>
                  <SubGuardIcon name="shield" size={14} /> {product.risk}
                </span>
                <span className="guard-score">SG {product.rating}</span>
              </div>

              {/* E-Commerce Footer with Strikethrough Pricing & Green Cart Button */}
              <div className="product-footer">
                <div>
                  <div style={{ display: 'flex', alignItems: 'baseline' }}>
                    <strong>${Number(product.price).toFixed(2)}</strong>
                    {hasDiscount && (
                      <span className="price-strike">
                        ${Number(product.original_price).toFixed(2)}
                      </span>
                    )}
                    {hasDiscount && (
                      <span className="discount-pill">
                        Save ${Number(product.original_price - product.price).toFixed(0)}
                      </span>
                    )}
                  </div>
                  <span className="unit">/ user / mo</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardClick(product);
                  }}
                  aria-label={`View details and provision ${product.name}`}
                  title="Provision with SubGuard Shield"
                  type="button"
                >
                  <SubGuardIcon name="arrow" size={17} />
                </button>
              </div>
            </article>
          );
        })}

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

      {/* Product Comparison & Shortlist Drawer */}
      <ProductCompareDrawer
        items={compareList}
        onRemoveItem={(id) => setCompareList((prev) => prev.filter((p) => p.product_id !== id))}
        onClearAll={() => setCompareList([])}
        onProvision={(tool) => {
          setCompareList([]);
          onSelectTool({
            product_name: tool.name || tool.product_name,
            pricing_tier: tool.pricing_tier,
            monthly_cost: tool.price || tool.monthly_cost,
            vendor_domain: tool.vendor_domain,
            tos_risk_score: tool.tos_risk_score
          });
        }}
      />
    </section>
  );
}
