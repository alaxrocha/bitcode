// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://bitcode.dev.br',
  output: 'static',
  trailingSlash: 'never',
  adapter: cloudflare({
    // Otimiza imagens no build (sharp); em runtime só repassa.
    imageService: 'compile',
  }),
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
