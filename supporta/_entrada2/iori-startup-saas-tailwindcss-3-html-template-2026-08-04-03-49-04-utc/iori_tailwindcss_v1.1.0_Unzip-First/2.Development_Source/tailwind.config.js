const gray = {
  0: 'var(--gray-0)',
  50: 'var(--gray-50)',
  60: 'var(--gray-60)',
  80: 'var(--gray-80)',
  100: 'var(--gray-100)',
  200: 'var(--gray-200)',
  300: 'var(--gray-300)',
  400: 'var(--gray-400)',
  500: 'var(--gray-500)',
  600: 'var(--gray-600)',
  700: 'var(--gray-700)',
  800: 'var(--gray-800)',
  900: 'var(--gray-900)',
};

const bgColor = {
  'first-bg': 'var(--first-bg)',
  'second-bg': 'var(--second-bg)',
  'third-bg': 'var(--third-bg)',
  'fourth-bg': 'var(--fourth-bg)',
  'fifth-bg': 'var(--fifth-bg)',
  'seventh-bg': 'var(--seventh-bg)',
};

const brandColor = {
  'first-brand': 'var(--first-brand)',
  'first-brand-hover': 'var(--first-brand-hover)',
  'second-brand': 'var(--second-brand)',
  'third-brand': 'var(--third-brand)',
  'fourth-brand': 'var(--fourth-brand)',
};

const systemColor = {
  success: 'var(--success)',
  danger: 'var(--danger)',
  warning: 'var(--warning)',
  mutted: 'var(--mutted)',
};

const typography = {
  'header-1': ['40px', '60px'],
  'header-2': ['48px', '56px'],
  'header-3': ['32px', '44px'],
  'header-4': ['28px', '34px'],
  'header-5': ['26px', '34px'],
  'header-6': ['18px', '24px'],
  'header-7': ['18px', '23px'],
  'header-8': ['16px', '28px'],
  'header-9': ['14px', '18px'],
  normal: ['14px', '16px'],
  subtitle: ['16px', '16px'],
  'subtitle-semibold': ['16px', '20px'],
  'btn-label': ['16px', '16px'],
  'mini-btn-label': ['14px', '20px'],
  desc: ['12px', '16px'],
  'mini-desc': ['12px', '18px'],
};

const radicalColors = {
  'radical-orange':
    'linear-gradient(0deg, #ddd 50%, transparent 50%), linear-gradient(-90deg, #EC8C56 50%, #ddd 50%);',
  'radical-blue':
    'linear-gradient(360deg, rgba(205, 226, 231, 0.44) 0%, rgba(205, 226, 231, 0) 100%);',
  'radical-skype':
    'linear-gradient(90deg, #ddd 50%, transparent 50%), linear-gradient(-90deg, #0BD6F4 50%, #ddd 50%);',
  'radical-green':
    'linear-gradient(90deg, #50D1B2 50%, transparent 50%), linear-gradient(-90deg, #50D1B2 50%, #ddd 50%);',
};

module.exports = {
  darkMode: 'class',
  content: ['src/views/*.pug', 'src/views/*/*.pug', 'src/views/*/*/*.pug', 'dist/*.html'],
  theme: {
    extend: {
      screens: {
        xs: '500px',
      },
      backgroundImage: {
        ...radicalColors,
        'hero-pattern': "url('images/homepage-9-ellipse-1.png')",
      },
      backgroundSize: {},
      colors: {
        gray,
        ...bgColor,
        ...brandColor,
        ...systemColor,
      },
      fontSize: {
        ...typography,
      },
      fontFamily: {
        inter: 'Inter',
      },
      keyframes: {},
      animation: {},
      boxShadow: {
        'drop-shadown-1': '0px 0px 30px rgba(14, 41, 50, 0.08)',
        'drop-shadown-2': '0px 0px 20px rgba(14, 41, 50, 0.17)',
        'drop-shadown-3': '9px 11px 23px rgba(6, 61, 79, 0.12)',
        'drop-shadown-4': '0px 0px 20.1613px rgba(14, 41, 50, 0.08)',
        'drop-shadown-5': '0px 0px 20px 0px rgb(14 41 50 / 17%)',
        'drop-shadown-6': '0 0 15px 0 rgb(0 0 0 / 9%)',
        'drop-shadown-7': '0px 0px 30px 0px rgb(14 41 50 / 8%)',
        'drop-shadown-8': '9px 11px 23px 0px rgb(6 61 79 / 12%)',
      },
    },
  },
  plugins: [require('@tailwindcss/line-clamp'), require('tailwind-scrollbar-hide')],
};
