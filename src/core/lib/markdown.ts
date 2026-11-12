import { marked } from 'marked';

/** Converte Markdown (texto escrito no painel) em HTML. Conteúdo vem só de editores do site. */
export function md(text: string | null | undefined): string {
  if (!text) return '';
  return marked.parse(text, { async: false, gfm: true, breaks: false }) as string;
}
