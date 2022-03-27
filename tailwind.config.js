module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      white: '#FFFFFF',
      black: '#000000',
      silver: '#FAFAFA',
      light: '#969494',
      'extra-light': '#e6e6e6',
      green: '#01F06F',
      red: '#FF3333',
      emerald: '#6EE7B7',
      cyan: '#22D3EE',
    },
    fontFamily: {
      sans: ['DM Sans', 'sans-serif'],
      mono: ['DM Mono', 'monospace'],
    },
    fontWeight: {
      regular: 400,
      medium: 500,
      bold: 700,
    },
    fontSize: {
      '12': '12px',
      '14': '14px',
      '15': '15px',
      '16': '16px',
      '18': '18px',
      '20': '20px',
      '24': '24px',
      '32': '32px',
    },
    lineHeight: {
      '14': '14px',
      '16': '16px',
      '18': '18px',
      '22': '22px',
      '24': '24px',
      '26': '26px',
      '28': '28px',
      '42': '42px',
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
