/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary - Warm Coral/Salmon
        primary: {
          DEFAULT: '#FF6B54',
          dark: '#E85A45',
          light: '#FF8A78',
        },
        // Secondary - Navy Blue
        secondary: {
          DEFAULT: '#1E3A5F',
          light: '#2A4A73',
        },
        // Background
        background: {
          DEFAULT: '#E8EDF3',
          warm: '#F5F3F0',
          dark: '#1C1C1E',
        },
        // Surface
        surface: {
          DEFAULT: '#FFFFFF',
          elevated: 'rgba(255, 255, 255, 0.72)',
          glass: 'rgba(255, 255, 255, 0.65)',
          dark: 'rgba(28, 28, 30, 0.85)',
        },
        // Text
        text: {
          DEFAULT: '#1A2B4A',
          secondary: '#6B7B8F',
          tertiary: '#9CA3AF',
          inverse: '#FFFFFF',
        },
        // Status
        success: '#34C759',
        warning: '#FF9500',
        error: '#FF3B30',
        info: '#007AFF',
      },
      fontFamily: {
        sans: ['Poppins', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      fontSize: {
        '2xs': '0.6875rem',  // 11px
        'xs': '0.8125rem',   // 13px
        'sm': '0.875rem',    // 14px
        'base': '0.9375rem', // 15px
        'md': '1.0625rem',   // 17px
        'lg': '1.25rem',     // 20px
        'xl': '1.5rem',      // 24px
        '2xl': '1.75rem',    // 28px
        '3xl': '2.125rem',   // 34px
        '4xl': '2.75rem',    // 44px
      },
      borderRadius: {
        'xs': '6px',
        'sm': '10px',
        'md': '14px',
        'lg': '20px',
        'xl': '28px',
        '2xl': '38px',
      },
      boxShadow: {
        'xs': '0 1px 2px rgba(0, 0, 0, 0.04)',
        'sm': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'md': '0 4px 16px rgba(0, 0, 0, 0.12)',
        'lg': '0 8px 32px rgba(0, 0, 0, 0.16)',
        'xl': '0 16px 48px rgba(0, 0, 0, 0.20)',
        'glass': '0 4px 24px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)',
        'glass-lg': '0 8px 40px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.06)',
        'primary': '0 4px 16px rgba(255, 107, 84, 0.35)',
        'primary-lg': '0 6px 20px rgba(255, 107, 84, 0.45)',
      },
      backdropBlur: {
        'xs': '8px',
        'sm': '12px',
        'md': '16px',
        'lg': '24px',
        'xl': '40px',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'fade-in-up': 'fadeInUp 0.4s ease-out',
        'fade-in-down': 'fadeInDown 0.4s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'spring-in': 'springIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-in-right': 'slideInRight 0.4s ease-out',
        'slide-in-left': 'slideInLeft 0.4s ease-out',
        'scale-in-up': 'scaleInUp 0.4s ease-out',
        'float': 'float 4s ease-in-out infinite',
        'wave': 'wave 2s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s infinite',
        'shimmer': 'shimmer 1.5s infinite',
        'bounce': 'bounce 1s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        springIn: {
          '0%': { opacity: '0', transform: 'scale(0.85)' },
          '50%': { transform: 'scale(1.02)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-12px) rotate(2deg)' },
        },
        wave: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-15deg)' },
          '75%': { transform: 'rotate(15deg)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(255, 107, 84, 0.4)' },
          '50%': { boxShadow: '0 0 0 12px rgba(255, 107, 84, 0)' },
        },
        shimmer: {
          '0%': { left: '-100%' },
          '100%': { left: '100%' },
        },
        bounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleInUp: {
          '0%': { opacity: '0', transform: 'scale(0.9) translateY(20px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        'safe-top': 'env(safe-area-inset-top, 0px)',
        'safe-bottom': 'env(safe-area-inset-bottom, 0px)',
      },
    },
  },
  plugins: [],
}
