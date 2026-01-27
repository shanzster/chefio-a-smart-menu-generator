import React from 'react';
import PropTypes from 'prop-types';
import styles from './ProgressBar.module.css';

/**
 * ProgressBar - Gamification progress bar
 */
const ProgressBar = ({ value, max = 100, label, showValue = true, variant = 'primary', className = '' }) => {
  const percentage = Math.min((value / max) * 100, 100);

  const barClasses = [
    styles.progressBar,
    styles[variant],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={barClasses}>
      {label && <div className={styles.label}>{label}</div>}
      <div className={styles.track}>
        <div
          className={styles.fill}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        >
          {showValue && (
            <span className={styles.value}>
              {value} / {max}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

ProgressBar.propTypes = {
  value: PropTypes.number.isRequired,
  max: PropTypes.number,
  label: PropTypes.string,
  showValue: PropTypes.bool,
  variant: PropTypes.oneOf(['primary', 'success', 'warning', 'info', 'gold']),
  className: PropTypes.string,
};

export default ProgressBar;






