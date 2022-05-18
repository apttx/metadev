import adapterStatic from '@sveltejs/adapter-static'
import sveltePreprocess from 'svelte-preprocess'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapterStatic(),
    prerender: {
      default: true,
      entries: ['/'],
    },
    paths: {
      assets: process.env.ASSET_PATH,
    },
  },
  preprocess: sveltePreprocess({
    postcss: {
      plugins: [tailwindcss(), autoprefixer()],
    },
  }),
}

export default config
