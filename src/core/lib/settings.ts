/**
 * Configurações do site, lidas do singleton "Configurações" do Keystatic
 * (src/content/settings.yaml).
 */
import { reader } from './content';

export interface NavLink {
  label: string;
  href: string;
}

export interface SiteConfig {
  name: string;
  logo: { first: string; second: string };
  tagline: string;
  description: string;
  locale: string;
  url: string;
  titleTemplate: string;
  homeTitle: string;
  whatsapp: { number: string; message: string };
  email: string;
  serviceArea: string;
  cfAnalyticsToken: string;
  social: { label: string; href: string }[];
  nav: NavLink[];
  footer: { title: string; links: NavLink[] }[];
}

const s = await reader.singletons.settings.readOrThrow();

export const site: SiteConfig = {
  name: s.name,
  logo: { first: s.logoFirst || s.name, second: s.logoSecond },
  tagline: s.tagline,
  description: s.description,
  locale: 'pt-BR',
  url: s.url || 'https://example.com',
  titleTemplate: s.titleTemplate || `%s | ${s.name}`,
  homeTitle: s.homeTitle || s.name,
  whatsapp: { number: s.whatsappNumber.replace(/\D/g, ''), message: s.whatsappMessage },
  email: s.email,
  serviceArea: s.serviceArea,
  cfAnalyticsToken: s.cfAnalyticsToken.trim(),
  social: s.social.filter((x) => x.href).map((x) => ({ label: x.label, href: x.href! })),
  nav: s.nav.map((l) => ({ ...l })),
  footer: s.footer.map((c) => ({ title: c.title, links: c.links.map((l) => ({ ...l })) })),
};
