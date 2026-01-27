import React from 'react';
import PropTypes from 'prop-types';

const variants = {
  default: 'bg-black/5 text-text-secondary',
  primary: 'bg-primary/10 text-primary',
  success: 'bg-success/15 text-success',
  warning: 'bg-warning/15 text-amber-700',
  error: 'bg-error/15 text-error',
  info: 'bg-info/15 text-info',
  glass: 'glass',
};

const sizes = {
  small: 'h-[22px] px-2 text-xs',
  medium: 'h-7 px-3 text-sm',
  large: 'h-[34px] px-4 text-base',
};

const Badge = ({
  children,
  variant = 'default',
  size = 'medium',
  icon,
  dot = false,
  className = '',
}) => {
  if (dot) {
    const dotSizes = {
      small: 'w-1.5 h-1.5',
      medium: 'w-2 h-2',
      large: 'w-2.5 h-2.5',
    };
    
    const dotColors = {
      default: 'bg-gray-400',
      primary: 'bg-primary',
      success: 'bg-success',
      warning: 'bg-warning',
      error: 'bg-error',
      info: 'bg-info',
      glass: 'bg-gray-400',
    };
    
    return (
      <span className={`rounded-full ${dotSizes[size]} ${dotColors[variant]} ${className}`} />
    );
  }

  return (
    <span className={`
      inline-flex items-center justify-center gap-1 rounded-full font-medium whitespace-nowrap
      ${variants[variant]}
      ${sizes[size]}
      ${className}
    `}>
      {icon && <span className="text-[0.9em]">{icon}</span>}
      {children}
    </span>
  );
};

Badge.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf(['default', 'primary', 'success', 'warning', 'error', 'info', 'glass']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  icon: PropTypes.node,
  dot: PropTypes.bool,
  className: PropTypes.string,
};

export default Badge;
