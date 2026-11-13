/**
 * Gera public/og-default.png (1200x630), a imagem que aparece ao compartilhar
 * o site no WhatsApp, LinkedIn, Facebook etc.
 * Uso: node scripts/og-image.mjs "bit" "Code" "Sites, landing pages e SEO"
 */
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';

const [first = 'bit', second = 'Code', tagline = 'Sites, landing pages e SEO feitos com código de verdade.'] =
  process.argv.slice(2);

const c = { dark: '#140d24', primary: '#7c3aed', soft: '#a78bfa', accent: '#22d3ee', muted: '#c9c2e0' };
const px = 22; // tamanho de cada "bit" do símbolo
const bracket = [
  [3, 2, 1], [2, 3, 1], [1, 4, 2], [2, 6, 1], [3, 7, 1],
  [6, 2, 1], [7, 3, 1], [8, 4, 2], [7, 6, 1], [6, 7, 1],
];
const slash = [
  [5, 3, 2], [4, 5, 2],
];
const rects = (list, fill, ox, oy) =>
  list.map(([x, y, h]) => `<rect x="${ox + x * px}" y="${oy + y * px}" width="${px}" height="${h * px}" fill="${fill}"/>`).join('');
const esc = (s) => s.replace(/[&<>]/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[m]);

// Grade decorativa no canto
const deco = [
  [0, 0, c.primary], [2, 0, c.accent], [3, 0, c.primary],
  [1, 1, c.soft], [3, 1, c.primary], [0, 2, c.soft], [2, 2, c.primary],
]
  .map(([x, y, f]) => `<rect x="${1010 + x * 30}" y="${70 + y * 30}" width="22" height="22" fill="${f}"/>`)
  .join('');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" shape-rendering="crispEdges">
  <rect width="1200" height="630" fill="${c.dark}"/>
  ${deco}
  ${rects(bracket, c.soft, 80, 150)}
  ${rects(slash, c.accent, 80, 150)}
  <text x="330" y="330" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="150" font-weight="700" letter-spacing="-5">
    <tspan fill="#ffffff">${esc(first)}</tspan><tspan fill="${c.soft}">${esc(second)}</tspan>
  </text>
  <text x="90" y="480" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="40" fill="${c.muted}">${esc(tagline)}</text>
  <rect x="90" y="540" width="120" height="8" fill="${c.accent}"/>
</svg>`;

const out = fileURLToPath(new URL('../public/og-default.png', import.meta.url));
await sharp(Buffer.from(svg)).png().toFile(out);
console.log('Gerado:', out);
