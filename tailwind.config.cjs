const isDev = process.env.NODE_ENV === 'development'

module.exports = {
  content: ['./src/**/*.{svelte,html,mjs,cjs,js}'],
  safelist: isDev ? [{ pattern: /./ }] : undefined,
  theme: {
    colors: {
      primary: '#4169E1',
      secondary: '#6495ED',
      primer: '#ffffff',
      confident: '#374048',
      good: '#2E8B57',
      warn: '#FFA500',
      danger: '#DC143C',
    },
    fontFamily: {
      sans: ['Manrope', 'sans-serif'],
      mono: ['Azeret Mono', 'monospace'],
    },
  },
}
