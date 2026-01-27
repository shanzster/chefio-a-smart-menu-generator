import React from 'react';
import PropTypes from 'prop-types';

const variants = {
  default: 'bg-white rounded-xl shadow-sm',
  glass: 'glass rounded-xl',
  elevated: 'bg-white rounded-xl shadow-md',
  flat: 'bg-white rounded-lg',
  outlined: 'bg-transparent rounded-xl border-2 border-gray-200',
};

const paddings = {
  none: '',
  small: 'p-4',
  medium: 'p-6',
  large: 'p-8',
};

const Card = ({
  children,
  variant = 'default',
  padding = 'medium',
  hover = false,
  onClick,
  className = '',
  ...props
}) => {
  const classes = `
    ${variants[variant]}
    ${paddings[padding]}
    ${hover ? 'hover-lift interactive-card' : ''}
    ${onClick ? 'cursor-pointer press-effect interactive-card' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  const Component = onClick ? 'button' : 'div';

  return (
    <Component className={classes} onClick={onClick} {...props}>
      {children}
    </Component>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['default', 'glass', 'elevated', 'flat', 'outlined']),
  padding: PropTypes.oneOf(['none', 'small', 'medium', 'large']),
  hover: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string,
};

export default Card;
