import type { Config } from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx,mdx}',
    './components/**/*.{ts,tsx}',
    './content/**/*.mdx'
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: '#0697e0',
        'background-light': '#f5f7f8',
        'background-dark': '#0f1c23',
      },
      fontFamily: {
        display: ['Inter', 'sans-serif'],
      },
    }
  },
  plugins: []
} satisfies Config;




