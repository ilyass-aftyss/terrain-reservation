/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        apple: {
          blue:         '#0071e3',
          link:         '#0066cc',
          accent:       '#2997ff',
          black:        '#000000',
          dark:         '#1d1d1f',
          'dark-2':     '#272729',
          gray:         '#f5f5f7',
          'medium-gray':'#d2d2d7',
          white:        '#ffffff',
        }
      },
      fontFamily: {
        sans: ['"SF Pro Display"', 'Inter', '-apple-system', 'BlinkMacSystemFont', '"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
      },
      fontSize: {
        'hero':         ['64px', { lineHeight: '1.05', letterSpacing: '-0.5px', fontWeight: '700' }],
        'hero-tablet':  ['44px', { lineHeight: '1.1',  fontWeight: '700' }],
        'hero-mobile':  ['34px', { lineHeight: '1.1',  fontWeight: '700' }],
        'headline':     ['32px', { lineHeight: '1.12', letterSpacing: '-0.3px' }],
        'body':         ['17px', { lineHeight: '1.47' }],
        'caption':      ['14px', { lineHeight: '1.29' }],
        'small':        ['12px', { lineHeight: '1.33' }],
      },
      spacing: {
        '2':  '2px',
        '4':  '4px',
        '6':  '6px',
        '8':  '8px',
        '12': '12px',
        '14': '14px',
        '17': '17px',
        '20': '20px',
        '24': '24px',
        '32': '32px',
        '48': '48px',
        '64': '64px',
        '96': '96px',
        '120':'120px',
        '160':'160px',
      },
      maxWidth: {
        'page':    '1440px',
        'content': '1100px',
        'narrow':  '680px',
      },
      borderRadius: {
        'apple': '8px',
        'card':  '18px',
        'xl':    '24px',
      },
      boxShadow: {
        'card':   '0 2px 20px rgba(0,0,0,0.08)',
        'soft':   '0 2px 8px rgba(0,0,0,0.06)',
        'hover':  '0 12px 40px rgba(0,0,0,0.14)',
        'pitch':  '0 8px 32px rgba(22,163,74,0.25)',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(28px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        countUp: {
          '0%':   { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up':  'fadeUp 0.7s cubic-bezier(.25,.1,.25,1) forwards',
        'fade-in':  'fadeIn 0.5s ease forwards',
        'count-up': 'countUp 0.6s ease forwards',
      }
    },
  },
  plugins: [],
}
