# Publicação (Fase 6)

Roteiro para colocar o site no ar na Cloudflare, com deploy automático a cada
push no GitHub. Os passos com contas (Cloudflare, Registro.br, Resend, GitHub)
precisam ser feitos por você; o código já está preparado.

Ordem recomendada: 1 → 2 → 3 (site no ar) → 4 (painel) → 5 e 6 (formulário) → 7.

---

## 1. Código no GitHub

O build da Cloudflare puxa o código do repositório `alaxrocha/bitcode`,
então tudo precisa estar commitado e enviado (`git push`).

## 2. Domínio na Cloudflare

1. Cloudflare → **Add a domain** → `bitcode.dev.br` → plano Free.
2. A Cloudflare mostra dois nameservers. No **Registro.br**, em
   *DNS → Alterar servidores DNS*, troque pelos dois da Cloudflare.
3. Espere a Cloudflare marcar o domínio como **Active** (minutos a algumas horas).

## 3. Worker com deploy automático (Workers Builds)

1. Cloudflare → **Workers & Pages → Create → Import a repository** →
   conecte o GitHub e escolha `alaxrocha/bitcode`.
2. Configuração do build:
   - Project name: `bitcode-site` (igual ao `name` do `wrangler.jsonc`)
   - Build command: `npm run build`
   - Deploy command: `npx wrangler deploy`
   - Branch de produção: `main`
3. Salve e aguarde o primeiro deploy. O site abre em
   `bitcode-site.<sua-conta>.workers.dev`.
4. **Settings → Domains & Routes → Add → Custom domain**: `bitcode.dev.br`.
   Repita para `www.bitcode.dev.br` se quiser (e crie um redirecionamento
   de `www` para o domínio sem `www` em *Rules → Redirect Rules*).

> O Astro declara um KV chamado `SESSION`. O Wrangler cria esse KV sozinho no
> primeiro deploy; o site não usa, então pode ignorar.

A Cloudflare tem dois lugares para variáveis, e isso importa:

| Onde | Para quê | Quais |
|---|---|---|
| Settings → **Build** → Variables and secrets | Valores que entram no build (públicos) | `PUBLIC_TURNSTILE_SITE_KEY`, `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` |
| Settings → **Variables and Secrets** (tipo *Secret*) | Valores lidos pelo Worker em tempo real | `RESEND_API_KEY`, `CONTACT_TO`, `CONTACT_FROM`, `TURNSTILE_SECRET_KEY`, `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET` |

Depois de mudar uma variável de **build**, rode um novo deploy
(*Deployments → Retry*, ou um novo push).

## 4. Painel online (Keystatic no modo GitHub)

No site publicado o painel (`/keystatic`) grava no GitHub: cada "Save" vira
um commit, e o commit dispara um novo deploy (1–2 minutos até aparecer).
Quem edita precisa de uma conta GitHub com acesso ao repositório.

1. No seu computador, crie um `.env` (copie do `.env.example`) e descomente
   `PUBLIC_KEYSTATIC_STORAGE=github`.
2. `npm run dev` e abra http://127.0.0.1:4321/keystatic.
3. O Keystatic oferece criar o **GitHub App**: dê um nome (ex.: `bitcode-painel`)
   e confirme no GitHub. Ele grava sozinho no `.env` os quatro valores:
   `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`, `KEYSTATIC_GITHUB_CLIENT_ID`,
   `KEYSTATIC_GITHUB_CLIENT_SECRET` e `KEYSTATIC_SECRET`.
4. Instale o app no repositório quando o GitHub pedir (*Only select
   repositories → bitcode*).
5. No GitHub: *Settings → Developer settings → GitHub Apps → (o app) →
   Callback URL*, adicione:
   `https://bitcode.dev.br/api/keystatic/github/oauth/callback`
   (o de `127.0.0.1:4321` pode ficar, para testes locais).
6. Copie os quatro valores para a Cloudflare (tabela do passo 3) e refaça o deploy.
7. Volte a comentar `PUBLIC_KEYSTATIC_STORAGE=github` no `.env` para o
   `npm run dev` continuar no modo local.

Testado: no ambiente da Cloudflare o login redireciona para o GitHub e a tela
"Log in with GitHub" aparece. Falta o teste real, com o app criado.

## 5. E-mail do formulário (Resend)

1. https://resend.com → crie a conta → **Domains → Add domain** → `bitcode.dev.br`.
2. O Resend lista registros DNS (SPF, DKIM e MX de retorno). Ele oferece
   configurar direto na Cloudflare; se não, crie-os em *DNS → Records*.
3. Quando o domínio ficar **Verified**: *API Keys → Create* (permissão
   *Sending access*).
4. Na Cloudflare (secrets): `RESEND_API_KEY`, `CONTACT_TO`
   (ex.: `contato@bitcode.dev.br`) e `CONTACT_FROM`
   (ex.: `Site bitCode <site@bitcode.dev.br>`).

> Para receber em `contato@bitcode.dev.br` é preciso uma caixa de e-mail
> (Cloudflare Email Routing encaminha grátis para um Gmail, por exemplo).

## 6. Anti-spam (Turnstile)

1. Cloudflare → **Turnstile → Add widget** → hostname `bitcode.dev.br`,
   modo *Managed*.
2. `PUBLIC_TURNSTILE_SITE_KEY` como variável de **build** e
   `TURNSTILE_SECRET_KEY` como **secret**. Refaça o deploy.

## 7. Depois de no ar

- **Analytics:** Cloudflare → *Web Analytics → Add a site* → copie o token
  e cole em *Configurações → Token do Cloudflare Web Analytics* no painel.
- **WhatsApp:** número real em *Configurações → WhatsApp* (só dígitos, com 55 + DDD).
- **Google Search Console:** adicione a propriedade de domínio (verificação por
  DNS na Cloudflare) e envie `https://bitcode.dev.br/sitemap-index.xml`.
- **Conferir:** formulário envia e chega; painel salva e o site atualiza;
  Lighthouse (Chrome DevTools) nas páginas principais; prévia de
  compartilhamento no WhatsApp.
