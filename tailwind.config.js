/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        axiom: {
          bgDeep: '#050510',
          bgPrimary: '#0A0A1A',
          bgSurface: '#141428',
          bgElevated: '#1E1E3A',
          primary: '#6C5CE7',
          primaryLight: '#8B7CF7',
          streak: '#00F5A0',
          amber: '#FFB703',
          reset: '#FF6B6B',
          calm: '#00D2FF',
          textPrimary: '#F0F0FF',
          textSecondary: '#8888AA',
          textDim: '#4A4A6A',
          border: '#2A2A4A',
        },
        lunamaze: {
          bgDeep: '#06081A',
          bgPrimary: '#0A0E27',
          bgSurface: '#121737',
          bgElevated: '#1A2150',
          violet: '#7B5CFF',
          violetLight: '#A48CFF',
          silver: '#C7CCE0',
          signal: '#FFD27A',
          textPrimary: '#F2F3FA',
          textSecondary: '#B6B9D2',
          textDim: '#6E72A0',
          border: '#22264A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'orbit': 'orbit 20s linear infinite',
        'orbit-reverse': 'orbitReverse 25s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        orbit: {
          '0%': { transform: 'rotate(0deg) translateX(120px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(120px) rotate(-360deg)' },
        },
        orbitReverse: {
          '0%': { transform: 'rotate(0deg) translateX(80px) rotate(0deg)' },
          '100%': { transform: 'rotate(-360deg) translateX(80px) rotate(360deg)' },
        },
      },
    },
  },
  plugins: [],
};
