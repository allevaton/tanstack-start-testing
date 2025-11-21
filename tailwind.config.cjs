/*
 ** TailwindCSS Configuration File
 **
 ** Docs: https://tailwindcss.com/docs/configuration
 ** Default: https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
 */

const colors = require('tailwindcss/colors');

const green = {
  50: '#F2FCF8',
  100: '#E6FAF1',
  200: '#C0F1DC',
  300: '#9AE9C7',
  400: '#4ED99E',
  500: '#02C874',
  600: '#02B468',
  700: '#017846',
  800: '#015A34',
  900: '#013C23',
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx,css}'],
  theme: {
    container: {
      center: true,
    },
    extend: {
      boxShadow: {
        top: '0 -2px 4px 0 rgba(0, 0, 0, 0.15)',
        raised: '0px 0px 16px rgba(0, 0, 0, 0.1)',
        high: '0 0 10px 0 rgba(173, 173, 173, 0.5)',
      },
      borderColor: (theme) => ({
        DEFAULT: theme('colors.pastel-green.500'),
      }),
      borderRadius: {
        DEFAULT: '8px',
        lg: '12px',
        sm: '4px',
        xs: '2px',
      },
      colors: {
        green,
        darkgrey: {
          50: '#F6F7F7',
          100: '#EDEEF0',
          200: '#D2D5D9',
          300: '#B7BBC3',
          400: '#808895',
          500: '#4A5568',
          600: '#434D5E',
          700: '#2C333E',
          800: '#21262F',
          900: '#161A1F',
        },
        black: '#4a4a4a',
        'true-black': '#000000',
        blue: {
          50: '#F3F8FD',
          100: '#E7F1FB',
          200: '#C4DDF4',
          300: '#A0C8EE',
          400: '#589FE1',
          500: '#1176D4',
          600: '#0F6ABF',
          700: '#0A477F',
          800: '#08355F',
          900: '#052340',
        },
        grey: colors.gray,
        gray: colors.gray,
        primary: green,
        red: {
          50: '#FEF6F6',
          100: '#FDEDED',
          200: '#F9D3D3',
          300: '#F6B9B9',
          400: '#EF8484',
          500: '#E84F4F',
          600: '#D14747',
          700: '#8B2F2F',
          800: '#682424',
          900: '#461818',
        },
        yellow: {
          50: '#FFFDF6',
          100: '#FFFAEE',
          200: '#FFF3D4',
          300: '#FFEBBB',
          400: '#FFDD87',
          500: '#FFCE54',
          600: '#fcb300',
          700: '#997C32',
          800: '#735D26',
          900: '#4D3E19',
        },

        /**
         * Primary color for most things
         */
        'turf-green': {
          50: '#e0ebe3',
          100: '#c3d7cb',
          200: '#9abba9',
          300: '#6e9982',
          400: '#3a614f',
          500: '#253C32',
          600: '#243932',
          700: '#3a4b44',
          800: '#203029',
          900: '#18201D',
        },

        /**
         * Placeholder or secondary text
         */
        'slate-green': {
          500: '#61716A',
          600: '#384841',
        },

        /**
         * Dividers and borders
         */
        'pastel-green': {
          300: '#f3f6f5',
          500: '#CFDCD6',
        },

        /**
         * Accent for hovers
         */
        'mint-green': {
          200: '#f8fffc',
          300: '#f5fdfa',
          400: '#f2fcf7',
          500: '#B4EED5',
        },

        // Accent backgrounds
        'off-white': {
          500: '#f8fffc',
        },
      },
      fontSize: {
        '2xs': '10px',
        '3xs': '9px',
        '4xl': '2rem',
        '5xl': '2.5rem',
        '6xl': '3rem',
        '7xl': '4rem',
      },
      fontWeight: {
        normal: 400,
        semibold: 500,
        bold: 700,
      },
      ringWidth: {
        1: '1px',
        DEFAULT: '3px',
      },
      ringOpacity: {
        DEFAULT: '0.20',
        90: '.9',
      },
      ringColor: (theme) => ({
        DEFAULT: theme('colors.green.500'),
      }),
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.turf-green.500'),
            a: {
              color: theme('colors.blue.500'),
              '&:hover': {
                color: theme('colors.blue.600'),
              },
            },
            'figure > figcaption': {
              color: theme('colors.slate-green.500'),
              textAlign: 'center',
            },
            'figure > img': {
              borderRadius: theme('borderRadius.DEFAULT'),
              marginBottom: '0.5rem',
            },
            video: {
              width: '600px',
              height: '400px',
            },
            table: {
              backgroundColor: 'white !important',
            },
          },
        },
        'slate-green': {
          css: {
            color: theme('colors.slate-green.500'),
            a: {
              fontWeight: theme('fontWeight.semibold'),
              color: theme('colors.slate-green.500'),
              textDecoration: 'underline',
              '&:hover': {
                color: theme('colors.slate-green.600'),
              },
            },
          },
        },
        white: {
          css: {
            color: theme('colors.white'),
            a: {
              color: theme('colors.white'),
              textDecoration: 'underline',
              '&:hover': {
                color: theme('colors.white'),
              },
            },
          },
        },
      }),
    },
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
  },
  variants: {
    scrollbar: ['dark', 'responsive'],
  },
  plugins: [
    // require('@tailwindcss/typography'),
    // require('@tailwindcss/forms')({
    //   strategy: 'class',
    // }),
    // require('tailwind-scrollbar'),
    // require('@tailwindcss/aspect-ratio'),
    // require('@headlessui/tailwindcss'),
  ],
};
