import React from 'react';
import SubGuardIcon from './SubGuardIcon';

export default function BrandLogo({ showWordmark = true, onClick }) {
  return (
    <div
      className="brand"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default', textDecoration: 'none' }}
    >
      <span className="brand-mark">
        <SubGuardIcon name="bag" size={20} />
        <span className="brand-shield">
          <SubGuardIcon name="shield" size={10} stroke={2.4} />
        </span>
      </span>
      {showWordmark && (
        <span className="brand-lockup">
          <span className="brand-name">
            Sub<span>Guard</span>
          </span>
          <small>SHOP SMART. STAY GUARDED.</small>
        </span>
      )}
    </div>
  );
}
