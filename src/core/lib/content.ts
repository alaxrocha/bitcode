/**
 * Leitura do conteúdo editado no Keystatic (arquivos em src/content).
 * Roda só no build (páginas pré-renderizadas no Node).
 */
import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../../keystatic.config';
import type { Action, PortfolioItem, Testimonial } from './types';

export const reader = createReader(process.cwd(), keystaticConfig);

export interface ActionValue {
  label: string;
  kind: 'whatsapp' | 'link';
  value: string;
}

/** Converte o campo "botão" do painel no formato usado pelos componentes. */
export function toAction(a: ActionValue | null | undefined): Action | undefined {
  if (!a || !a.label.trim()) return undefined;
  return a.kind === 'whatsapp' ? { label: a.label, whatsapp: a.value } : { label: a.label, href: a.value || '#' };
}

export const categoryLabels: Record<string, string> = {
  site: 'Site institucional',
  landing: 'Landing page',
  ecommerce: 'E-commerce',
  sistema: 'Sistema',
};

export async function getServices() {
  const all = await reader.collections.services.all();
  return all
    .filter((s) => s.entry.active)
    .sort((a, b) => (a.entry.order ?? 0) - (b.entry.order ?? 0));
}

export async function getPortfolio(opts: { featuredOnly?: boolean; category?: string; limit?: number } = {}) {
  const all = await reader.collections.portfolio.all();
  let items = all
    .filter((p) => !opts.featuredOnly || p.entry.featured)
    .filter((p) => !opts.category || p.entry.category === opts.category)
    .sort((a, b) => (b.entry.year || '').localeCompare(a.entry.year || ''));
  if (opts.limit && opts.limit > 0) items = items.slice(0, opts.limit);
  return items.map(
    (p): PortfolioItem => ({
      title: p.entry.client || p.entry.title,
      category: categoryLabels[p.entry.category] ?? p.entry.category,
      year: p.entry.year || undefined,
      image: p.entry.cover || undefined,
      thunderweb: p.entry.thunderweb,
      href: `/portfolio/${p.slug}`,
    }),
  );
}

export async function getTestimonials(limit = 0): Promise<Testimonial[]> {
  const all = await reader.collections.testimonials.all();
  const items = all.filter((t) => t.entry.featured);
  return (limit > 0 ? items.slice(0, limit) : items).map((t) => ({
    quote: t.entry.quote,
    name: t.entry.name,
    company: t.entry.company || undefined,
    photo: t.entry.photo || undefined,
  }));
}
