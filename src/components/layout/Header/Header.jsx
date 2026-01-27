import React from 'react';
import PropTypes from 'prop-types';
import { FiSearch, FiGrid } from 'react-icons/fi';

const Header = ({ 
  title,
  subtitle,
  showSearch = false,
  showGrid = false,
  leftAction,
  rightAction,
  transparent = false,
  className = '',
}) => {
  return (
    <header className={`
      sticky top-0 left-0 right-0 z-50 pt-safe
      ${transparent 
        ? 'bg-transparent' 
        : 'bg-white/72 backdrop-blur-lg border-b border-black/5'
      }
      ${className}
    `}>
      <div className="flex items-center justify-between h-14 px-4 max-w-[1200px] mx-auto">
        {/* Left section */}
        <div className="flex items-center gap-2 min-w-[60px]">
          {leftAction}
        </div>

        {/* Center - Title */}
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          {subtitle && (
            <span className="text-2xs text-text-tertiary uppercase tracking-wider">
              {subtitle}
            </span>
          )}
          {title && (
            <h1 className="text-md font-semibold text-text tracking-tight">
              {title}
            </h1>
          )}
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2 min-w-[60px] justify-end">
          {showSearch && (
            <button className="w-9 h-9 flex items-center justify-center rounded-sm text-text text-xl hover:bg-black/5 active:scale-95 active:opacity-80 transition-all" aria-label="Search">
              <FiSearch />
            </button>
          )}
          {showGrid && (
            <button className="w-9 h-9 flex items-center justify-center rounded-sm text-text text-xl hover:bg-black/5 active:scale-95 active:opacity-80 transition-all" aria-label="Grid view">
              <FiGrid />
            </button>
          )}
          {rightAction}
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  showSearch: PropTypes.bool,
  showGrid: PropTypes.bool,
  leftAction: PropTypes.node,
  rightAction: PropTypes.node,
  transparent: PropTypes.bool,
  className: PropTypes.string,
};

export default Header;
