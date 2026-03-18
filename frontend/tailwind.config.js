import plugin from 'tailwindcss/plugin';

import { components } from './src/libs/tailwindcss/components';
import { themeExtend } from './src/libs/tailwindcss/theme-extend';

export default {
  content: ['src/**/*.{js,jsx,ts,tsx}'],

  plugins: [
    plugin(function ({ addComponents }) {
      addComponents(components);
    }),
  ],

  prefix: '',

  theme: {
    extend: themeExtend,
  },
};
