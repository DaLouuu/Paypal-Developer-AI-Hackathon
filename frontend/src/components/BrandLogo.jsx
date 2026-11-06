import React from 'react';

/**
 * Distinctive SubGuard AI Brand Logo:
 * Combines an e-commerce shopping tote geometry with an embedded protective shield and checkmark.
 */
export default function BrandLogo({ size = 32, withText = true, subtitle = "Autonomous SaaS Marketplace & Protection" }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px' }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        {/* Background rounded squircle */}
        <rect width="40" height="40" rx="10" fill="#17243D" />

        {/* E-Commerce Bag Contour */}
        <path
          d="M11 15C11 13.8954 11.8954 13 13 13H27C28.1046 13 29 13.8954 29 15L30.5 28C30.5 29.6569 29.1569 31 27.5 31H12.5C10.8431 31 9.5 29.6569 9.5 28L11 15Z"
          fill="#293A55"
        />

        {/* Bag Handle */}
        <path
          d="M15 14V11C15 8.79086 16.7909 7 19 7H21C23.2091 7 25 8.79086 25 11V14"
          stroke="#4568F5"
          strokeWidth="2.2"
          strokeLinecap="round"
        />

        {/* Embedded Protective Shield */}
        <path
          d="M20 17L26 19.5V23.5C26 27 22.5 29.5 20 30.5C17.5 29.5 14 27 14 23.5V19.5L20 17Z"
          fill="#4568F5"
        />

        {/* Inner Guard Checkmark */}
        <path
          d="M17.5 23.8L19.2 25.5L22.8 21.5"
          stroke="#22B982"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {withText && (
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '17px', fontWeight: 800, color: '#17243D', letterSpacing: '-0.03em' }}>
              SubGuard<span style={{ color: '#4568F5' }}>.ai</span>
            </span>
            <span
              style={{
                fontSize: '9px',
                fontWeight: 700,
                color: '#22B982',
                backgroundColor: 'rgba(34, 185, 130, 0.1)',
                border: '1px solid rgba(34, 185, 130, 0.25)',
                borderRadius: '4px',
                padding: '1px 5px',
                letterSpacing: '0.04em',
                textTransform: 'uppercase'
              }}
            >
              Protected
            </span>
          </div>
          {subtitle && (
            <span style={{ fontSize: '11px', fontWeight: 500, color: '#64748b' }}>
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
