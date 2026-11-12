import { site } from '@site/config';

/** Monta o link do WhatsApp com mensagem pré-preenchida. */
export function whatsappUrl(message: string = site.whatsapp.message): string {
  const text = encodeURIComponent(message);
  return `https://wa.me/${site.whatsapp.number}?text=${text}`;
}
