import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const variants = {
  primary: 'bg-primary text-white shadow-primary hover:bg-primary-dark hover:shadow-primary-lg hover:-translate-y-0.5',
  secondary: 'bg-secondary text-white shadow-lg hover:bg-secondary-light hover:-translate-y-0.5',
  ghost: 'text-primary hover:bg-primary/10',
  outline: 'border-2 border-gray-200 text-text hover:bg-black/5 hover:border-gray-300',
  glass: 'glass text-text hover:bg-white/45 hover:-translate-y-0.5',
  danger: 'bg-error text-white shadow-lg hover:bg-red-600',
};

const sizes = {
  small: 'h-9 px-4 text-sm rounded-sm',
  medium: 'h-12 px-6 text-base rounded-md',
  large: 'h-14 px-8 text-md rounded-lg',
};

const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  as,
  to,
  href,
  className = '',
  ...props
}) => {
  const baseClasses = `
    inline-flex items-center justify-center gap-2 font-semibold
    transition-all duration-300 ease-out
    active:scale-[0.97] active:opacity-90
    disabled:opacity-40 disabled:pointer-events-none
    relative overflow-hidden
    ${variants[variant]}
    ${sizes[size]}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  const content = (
    <>
      {loading && (
        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="31.416" strokeDashoffset="10" />
        </svg>
      )}
      {icon && iconPosition === 'left' && !loading && (
        <span className="text-[1.15em]">{icon}</span>
      )}
      {children && <span className="whitespace-nowrap">{children}</span>}
      {icon && iconPosition === 'right' && !loading && (
        <span className="text-[1.15em]">{icon}</span>
      )}
    </>
  );

  if (as === Link || to) {
    return (
      <Link to={to} className={baseClasses} {...props}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={baseClasses} {...props}>
        {content}
      </a>
    );
  }

  return (
    <button className={baseClasses} disabled={disabled || loading} {...props}>
      {content}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf(['primary', 'secondary', 'ghost', 'outline', 'danger', 'glass']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  icon: PropTypes.node,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  as: PropTypes.elementType,
  to: PropTypes.string,
  href: PropTypes.string,
  className: PropTypes.string,
};

export default Button;
