// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import tailwindcss from '@tailwindcss/vite';

// No `astro dev` rodamos sem o adapter da Cloudflare: assim o painel do Keystatic
// (modo local) roda no Node e consegue ler e gravar os arquivos de conteúdo.
// O build e o deploy usam o adapter normalmente.
const isDev = process.argv.includes('dev');

export default defineConfig({
  site: 'https://bitcode.dev.br',
  output: 'static',
  trailingSlash: 'never',
  adapter: isDev
    ? undefined
    : cloudflare({
        // Otimiza imagens no build (sharp); em runtime só repassa.
        imageService: 'compile',
        // Páginas estáticas são geradas no Node para ler o conteúdo do Keystatic do disco.
        prerenderEnvironment: 'node',
      }),
  integrations: [
    react(),
    keystatic(),
    sitemap({ filter: (page) => !page.includes('/keystatic') }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
