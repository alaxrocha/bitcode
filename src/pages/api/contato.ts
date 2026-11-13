/**
 * Recebe o formulário de contato, valida, confere o anti-spam (Turnstile)
 * e envia o e-mail pela API do Resend. Roda sob demanda no Worker.
 */
import type { APIRoute } from 'astro';
import { CONTACT_FROM, CONTACT_TO, RESEND_API_KEY, TURNSTILE_SECRET_KEY } from 'astro:env/server';

export const prerender = false;

const json = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8' } });

const clean = (v: FormDataEntryValue | null, max: number) =>
  String(v ?? '')
    .replace(/\r/g, '')
    .trim()
    .slice(0, max);

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

async function verifyTurnstile(token: string, ip: string | null): Promise<boolean> {
  if (!TURNSTILE_SECRET_KEY) return true; // anti-spam não configurado
  if (!token) return false;
  const body = new FormData();
  body.append('secret', TURNSTILE_SECRET_KEY);
  body.append('response', token);
  if (ip) body.append('remoteip', ip);
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body });
  const data = (await res.json()) as { success?: boolean };
  return data.success === true;
}

export const POST: APIRoute = async ({ request }) => {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json(400, { ok: false, error: 'invalid_body' });
  }

  // Armadilha para robôs: campo invisível preenchido = spam. Respondemos "ok" sem enviar.
  if (clean(form.get('site'), 200)) return json(200, { ok: true });

  const data = {
    nome: clean(form.get('nome'), 120),
    whatsapp: clean(form.get('whatsapp'), 40),
    email: clean(form.get('email'), 160),
    servico: clean(form.get('servico'), 60),
    mensagem: clean(form.get('mensagem'), 5000),
    lgpd: form.get('lgpd') !== null,
  };

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);
  if (!data.nome || !data.whatsapp || !emailOk || !data.mensagem || !data.lgpd) {
    return json(422, { ok: false, error: 'invalid_fields' });
  }

  const ip = request.headers.get('cf-connecting-ip');
  if (!(await verifyTurnstile(clean(form.get('cf-turnstile-response'), 4000), ip))) {
    return json(403, { ok: false, error: 'captcha' });
  }

  if (!RESEND_API_KEY || !CONTACT_TO || !CONTACT_FROM) {
    console.warn('[contato] envio de e-mail não configurado (RESEND_API_KEY, CONTACT_TO, CONTACT_FROM).');
    return json(503, { ok: false, error: 'not_configured' });
  }

  const rows = [
    ['Nome', data.nome],
    ['WhatsApp', data.whatsapp],
    ['E-mail', data.email],
    ['Serviço', data.servico],
  ]
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#5b5670">${k}</td><td><strong>${escapeHtml(v)}</strong></td></tr>`)
    .join('');
  const html = `<div style="font-family:Arial,sans-serif;font-size:15px;color:#1e1b2e">
<h2 style="margin:0 0 16px">Novo contato pelo site</h2>
<table>${rows}</table>
<p style="margin:20px 0 6px;color:#5b5670">Mensagem:</p>
<p style="white-space:pre-line;margin:0">${escapeHtml(data.mensagem)}</p>
</div>`;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: CONTACT_FROM,
      to: CONTACT_TO.split(',').map((s) => s.trim()),
      reply_to: data.email,
      subject: `Contato pelo site: ${data.nome} (${data.servico || 'geral'})`,
      html,
    }),
  });

  if (!res.ok) {
    console.error('[contato] falha no envio', res.status, await res.text());
    return json(502, { ok: false, error: 'send_failed' });
  }
  return json(200, { ok: true });
};

export const ALL: APIRoute = () => json(405, { ok: false, error: 'method_not_allowed' });
