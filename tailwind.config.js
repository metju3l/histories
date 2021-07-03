module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      borderRadius: {
        widget: '1.4em',
      },
      colors: {
        yellow: '#FCAF58',
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
