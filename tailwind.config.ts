import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        pulse: {
          bg: 'var(--bg-primary)',
          panel: 'var(--bg-secondary)',
          field: 'var(--bg-tertiary)',
          border: 'var(--border)',
          red: 'var(--red-primary)'
        }
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
        mono: ['var(--font-mono)']
      }
    }
  },
  plugins: []
};
export default config;
