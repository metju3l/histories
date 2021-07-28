module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: { inter: ['Inter', 'sans-serif'] },
      borderRadius: {
        widget: '1.4em',
      },
      colors: {
        yellow: '#FCAF58',
        darkGray: '#1D1D1D',
        lightGray: '#878787',
      },
      height: {
        content: '95%',
      },
      minWidth: {
        sidebar: '550px',
      },
      maxWidth: {
        sidebar: '840px',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('tailwind-scrollbar-hide')],
};
