import React, { forwardRef, useState } from 'react';
import PropTypes from 'prop-types';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const Input = forwardRef(({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  helperText,
  icon,
  disabled = false,
  required = false,
  variant = 'default',
  size = 'medium',
  className = '',
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  const sizeClasses = {
    small: 'h-10 text-sm',
    medium: 'h-[52px] text-base',
    large: 'h-[60px] text-md rounded-lg',
  };

  const variantClasses = {
    default: 'bg-white border-gray-200 focus:border-primary focus:ring-primary/10',
    glass: 'bg-white/60 backdrop-blur-sm border-white/40 focus:bg-white/85 focus:border-primary focus:ring-primary/10',
    filled: 'bg-black/5 border-transparent focus:bg-white focus:border-primary focus:ring-primary/10',
  };

  return (
    <div className={`flex flex-col gap-1 w-full ${className}`}>
      {label && (
        <label className={`text-sm font-medium pl-1 ${error ? 'text-error' : 'text-text-secondary'}`}>
          {label}
          {required && <span className="text-error ml-0.5">*</span>}
        </label>
      )}
      
      <div className="relative flex items-center">
        {icon && (
          <span className={`absolute left-4 text-[1.15em] pointer-events-none z-10 transition-colors ${isFocused ? 'text-primary' : 'text-text-tertiary'}`}>
            {icon}
          </span>
        )}
        
        <input
          ref={ref}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            w-full px-4 border rounded-md
            text-text placeholder:text-text-tertiary
            transition-all duration-200
            focus:outline-none focus:ring-4
            disabled:opacity-50 disabled:pointer-events-none
            ${sizeClasses[size]}
            ${variantClasses[variant]}
            ${icon ? 'pl-11' : ''}
            ${isPassword ? 'pr-12' : ''}
            ${error ? 'border-error focus:ring-error/10' : ''}
          `}
          {...props}
        />
        
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="absolute right-3 w-8 h-8 flex items-center justify-center rounded-sm text-text-tertiary hover:text-text hover:bg-black/5 transition-colors"
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        )}
      </div>
      
      {(error || helperText) && (
        <p className={`text-xs pl-1 ${error ? 'text-error' : 'text-text-tertiary'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

Input.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  error: PropTypes.string,
  helperText: PropTypes.string,
  icon: PropTypes.node,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  variant: PropTypes.oneOf(['default', 'glass', 'filled']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  className: PropTypes.string,
};

export default Input;
