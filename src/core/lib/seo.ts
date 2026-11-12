import { site } from '@core/lib/settings';

export interface SeoProps {
  /** Título da página, sem o nome do site. Vazio = só o nome do site (home). */
  title?: string;
  description?: string;
  /** Caminho de imagem para redes sociais (absoluto ou relativo ao site). */
  image?: string;
  noindex?: boolean;
}

export function buildTitle(title?: string): string {
  return title ? site.titleTemplate.replace('%s', title) : site.homeTitle;
}

export function absoluteUrl(path: string, base: URL | string = site.url): string {
  return new URL(path, base).toString();
}
