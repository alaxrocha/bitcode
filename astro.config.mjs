// @ts-check
import { defineConfig, envField } from 'astro/config';
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
  // Gera /sobre.html (e não /sobre/index.html): a Cloudflare serve em /sobre,
  // sem redirecionar para /sobre/, batendo com a URL canônica.
  build: { format: 'file' },
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
  // Variáveis de ambiente (veja .env.example). Todas opcionais: sem elas o
  // formulário responde "indisponível" e o visitante é orientado ao WhatsApp.
  env: {
    schema: {
      RESEND_API_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      CONTACT_TO: envField.string({ context: 'server', access: 'secret', optional: true }),
      CONTACT_FROM: envField.string({ context: 'server', access: 'secret', optional: true }),
      TURNSTILE_SECRET_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      PUBLIC_TURNSTILE_SITE_KEY: envField.string({ context: 'client', access: 'public', optional: true }),
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
