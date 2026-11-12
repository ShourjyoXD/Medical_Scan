/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#121619', // Deep Mineral
        surface: {
          DEFAULT: 'transparent', // Deep Mineral canvas with subtle X-ray background
          card: '#1C2226',    // Elevated Obsidian
          elevated: '#22292E',
          inner: '#151A1D',   // Inset / viewport
          subtle: '#181F23',
        },
        border: {
          DEFAULT: '#263037', // Subtle cool grey border
          subtle: '#1F272C',
          strong: '#323E47',
        },
        text: {
          primary: '#EEF2F4', // Off-White Pearl
          muted: '#8E9BA4',   // Muted Cool Grey
        },
        primary: {
          DEFAULT: '#EEF2F4',
          muted: '#4C7DA7',
        },
        muted: '#8E9BA4',
        brand: {
          DEFAULT: '#4C7DA7', // Nordic Blue
          hover: '#5B8FB9',
          active: '#3D698C',
          subtle: 'rgba(76, 125, 167, 0.12)',
        },
        mint: {
          DEFAULT: '#73BDA8', // Soft Mint
          hover: '#83CCA7',
          subtle: 'rgba(115, 189, 168, 0.12)',
        },
        crimson: {
          DEFAULT: '#E06A60', // Muted Crimson
          hover: '#E97A71',
          subtle: 'rgba(224, 106, 96, 0.12)',
        },
        amber: {
          DEFAULT: '#D89A52',
          subtle: 'rgba(216, 154, 82, 0.12)',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif',
        ],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(0, 0, 0, 0.35), 0 1px 2px -1px rgba(0, 0, 0, 0.25)',
        'card-hover': '0 4px 14px -2px rgba(0, 0, 0, 0.5), 0 2px 4px -2px rgba(0, 0, 0, 0.35)',
      },
      borderRadius: {
        xl: '0.75rem',
        '2xl': '1rem',
      },
    },
  },
  plugins: [],
};
