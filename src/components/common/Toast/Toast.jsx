import React, { useEffect } from 'react';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';

const Toast = ({ 
  message, 
  type = 'success', 
  duration = 4000, 
  onClose 
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FiCheckCircle className="w-5 h-5 text-success" />;
      case 'error':
        return <FiAlertCircle className="w-5 h-5 text-error" />;
      case 'info':
        return <FiInfo className="w-5 h-5 text-primary" />;
      default:
        return <FiCheckCircle className="w-5 h-5 text-success" />;
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case 'success':
        return 'border-success';
      case 'error':
        return 'border-error';
      case 'info':
        return 'border-primary';
      default:
        return 'border-primary';
    }
  };

  const getProgressColor = () => {
    switch (type) {
      case 'success':
        return 'bg-success';
      case 'error':
        return 'bg-error';
      case 'info':
        return 'bg-primary';
      default:
        return 'bg-primary';
    }
  };

  return (
    <div 
      className={`relative flex items-center gap-3 min-w-[320px] max-w-[420px] p-4 bg-white/95 backdrop-blur-xl rounded-xl border-2 ${getBorderColor()} shadow-2xl animate-slide-in-right overflow-hidden`}
      style={{ 
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5) inset'
      }}
    >
      {/* Icon */}
      <div className="flex-shrink-0">
        {getIcon()}
      </div>

      {/* Message */}
      <p className="flex-1 text-sm font-medium text-text">
        {message}
      </p>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
      >
        <FiX className="w-4 h-4 text-text-tertiary" />
      </button>

      {/* Progress Line */}
      <div 
        className={`absolute bottom-0 left-0 h-1 ${getProgressColor()} animate-toast-progress`}
        style={{ 
          animationDuration: `${duration}ms`,
          transformOrigin: 'left'
        }}
      />
    </div>
  );
};

export default Toast;
