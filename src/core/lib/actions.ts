import type { Action } from './types';
import { whatsappUrl } from './whatsapp';

export function resolveAction(action: Action): { href: string; external: boolean } {
  if (action.whatsapp !== undefined) {
    return { href: whatsappUrl(action.whatsapp || undefined), external: true };
  }
  const href = action.href ?? '#';
  return { href, external: /^https?:\/\//.test(href) };
}
