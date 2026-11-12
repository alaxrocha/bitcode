/** Dados estruturados (JSON-LD) para o Google. */
import { site } from './settings';

export interface Crumb {
  label: string;
  href?: string;
}

export function breadcrumbSchema(crumbs: Crumb[], currentPath: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.label,
      item: new URL(c.href ?? currentPath, site.url).toString(),
    })),
  };
}

export function serviceSchema(name: string, description: string, path: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    url: new URL(path, site.url).toString(),
    areaServed: { '@type': 'Country', name: 'Brasil' },
    provider: { '@type': 'ProfessionalService', name: site.name, url: site.url },
  };
}

export function articleSchema(a: { title: string; description: string; path: string; date?: string | null; image?: string | null }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: a.title,
    description: a.description,
    url: new URL(a.path, site.url).toString(),
    datePublished: a.date || undefined,
    image: a.image ? new URL(a.image, site.url).toString() : undefined,
    author: { '@type': 'Organization', name: site.name },
    publisher: { '@type': 'Organization', name: site.name },
  };
}
