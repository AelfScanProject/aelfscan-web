/*
 * @Author: aelf-lxy
 * @Date: 2023-08-02 01:50:01
 * @LastEditors: Peterbjx
 * @LastEditTime: 2023-08-18 11:18:49
 * @Description: tailwind config
 */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // if using `src` directory:
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'main-blue': '#1D2A51',
        'rise-red': '#FF4D4F',
        'fall-green': '#05bd72',
        'global-grey': '#f7f8f9',
        foreground: '#020617',
        'secondary-foreground': '#0F172A',
        'muted-foreground': '#64748B',
        muted: '#F1F5F9',
        muted05: '#F8FAFC',
        accentBlue: '#1D4ED8',
        'accent-teal': '#0F766E',
        'accent-pink': '#BE185D',
        border: '#E2E8F0',
        success: '#16A34A',
        warning: '#CA8A04',
        destructive: '#DC2626',
        primary: '#2563EB',
        secondary: '#EFF6FF',
        'accent-blue-background': '#EFF6FF',
        'accent-teal-background': '#F0FDFA',
        'accent-pink-background': '#FDF2F8',
        base: {
          100: '#252525',
          200: '#858585',
        },
        link: '#266CD3',
        D0: '#D0D0D0',
        '00': '#000000',
        32: '#327DEC',
        F7: '#F7F8FA',
        'color-divider': '#E6E6E6',
        confirm: '#00A186',
        title: '#383947',
        'confirm-br': '#BCE1D8',
        'confirm-bg': '#EAF5F3',
        ECEEF2: '#ECEEF2',
        button_active: '#155ABF',
        pink_stroke: '#FFD0D0',
        pink_fill: '#FFEDED',
        scorpion: '#595959',
        positive: '#00A186',
        'yellow-stroke': '#FADEAB',
        'yellow-fill': '#FEF6E7',
      },
      boxShadow: {
        table: '0px 8px 16px 0px rgba(0, 0, 0, 0.04)',
        search: '0px 6px 24px 0px rgba(0, 0, 0, 0.24)',
        row_tab: '0px -2px 0px 0px #266CD3',
        row_tab_inset: '0px -2px 0px 0px #266CD3 inset',
        title_bot: '0px -1px 0px 0px #E6E6E6 inset',
        card_box: '0px 1px 2px 0px rgba(0, 0, 0, 0.05)',
      },
      lineHeight: {
        20: '20px',
        22: '1.375rem',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      flex: {
        '00auto': '0 0 auto',
      },
      screens: {
        'min-769': '769px',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.font-medium': {
          fontVariationSettings: '"wght" 500',
          '-webkit-font-smoothing': 'antialiased',
          '-moz-osx-font-smoothing': 'grayscale',
          fontWeight: 'normal !important',
        },
        '.font-semibold': {
          fontVariationSettings: '"wght" 600',
          '-webkit-font-smoothing': 'antialiased',
          '-moz-osx-font-smoothing': 'grayscale',
          fontWeight: 'normal !important',
        },
        '.font-bold': {
          fontVariationSettings: '"wght" 700',
          '-webkit-font-smoothing': 'antialiased',
          '-moz-osx-font-smoothing': 'grayscale',
          fontWeight: 'normal !important',
        },
      });
    },
  ],
};
