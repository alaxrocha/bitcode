import type { APIRoute } from 'astro';
import { site } from '@core/lib/settings';

// Gerado no build: com o site "em construção", bloqueia toda a indexação.
export const GET: APIRoute = ({ site: siteUrl }) => {
  const body = site.comingSoon
    ? 'User-agent: *\nDisallow: /\n'
    : [
        'User-agent: *',
        'Allow: /',
        'Disallow: /keystatic',
        'Disallow: /api/',
        '',
        `Sitemap: ${new URL('/sitemap-index.xml', siteUrl ?? site.url).href}`,
        '',
      ].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
