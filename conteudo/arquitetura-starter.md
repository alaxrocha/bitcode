# bitCode Starter: arquitetura (v1)

> Objetivo: **um único modelo de site** que vira o site da bitCode e, copiado e configurado, vira o site de cada cliente.
> Regra de ouro: **código compartilhado de um lado, conteúdo e configuração do cliente do outro.**

---

## 1. Stack

| Camada | Escolha | Por quê |
|---|---|---|
| Framework | **Astro** (versão estável atual) | HTML estático, zero JS por padrão, Lighthouse alto |
| CMS | **Keystatic** | Conteúdo em arquivos no Git, painel em `/keystatic`, sem banco |
| Estilo | **Tailwind CSS v4** com tokens em CSS variables | Trocar a marca do cliente = trocar algumas variáveis |
| Hospedagem | **Cloudflare Workers (static assets)** + adapter `@astrojs/cloudflare` | Grátis, CDN global, deploy por push |
| Repositório | **GitHub**, um repo por site | Histórico, deploy automático, base do Keystatic |
| Formulário | Endpoint próprio no Worker + **Cloudflare Turnstile** (anti-spam) + serviço de e-mail transacional (ex.: Resend) | Sem terceiros caros, sem captcha chato |
| Analytics | **Cloudflare Web Analytics** (sem cookies) + Search Console | Dispensa banner de cookies. GA4 só se o cliente exigir |
| Fontes | **Fontsource** (auto-hospedadas) | Mais rápidas e sem enviar IP do visitante ao Google (LGPD) |

**Renderização:** o site é **estático**. Só as rotas `/keystatic`, `/api/keystatic/*` e `/api/contato` rodam sob demanda no Worker.

---

## 2. Estratégia de replicação para clientes

**Recomendado: repositório-modelo + remote "upstream".**

```
github.com/bitcode/starter          ← modelo (GitHub "Template repository")
github.com/bitcode/site-bitcode     ← site da bitCode
github.com/bitcode/site-cliente-x   ← cliente X
```

1. Cliente novo: "Use this template" no GitHub → novo repositório.
2. No repo do cliente: `git remote add upstream <starter>`.
3. Correção ou componente novo no starter? Em cada cliente: `git pull upstream main`.
4. Não há conflito porque **o cliente só altera** `src/content/`, `src/site/` e `public/`, que o starter nunca altera depois de criado.

> Evolução futura (com mais de 15 clientes): extrair `src/core` para um pacote npm privado `@bitcode/core`. Não vale a complexidade agora.

---

## 3. Estrutura de pastas

```
starter/
├─ astro.config.mjs
├─ keystatic.config.ts          ← esquema do painel (core, não editar por cliente)
├─ wrangler.jsonc               ← config Cloudflare
├─ public/
│  ├─ favicon.svg               ← [cliente]
│  └─ robots.txt                ← gerado
├─ src/
│  ├─ core/                     ← COMPARTILHADO (vem do starter)
│  │  ├─ layouts/
│  │  │  ├─ BaseLayout.astro    (head, SEO, fontes, analytics)
│  │  │  └─ PageLayout.astro    (header + main + footer + WhatsApp)
│  │  ├─ components/
│  │  │  ├─ ui/                 Button, Badge, Container, SectionHeading, Logo, PixelDeco, Icon
│  │  │  ├─ chrome/             Header, MobileMenu, Footer, WhatsAppFloat, Breadcrumbs
│  │  │  └─ blocks/             ← blocos de página (ver seção 5)
│  │  ├─ lib/
│  │  │  ├─ seo.ts              (title, description, canonical, OG)
│  │  │  ├─ schema.ts           (JSON-LD: Organization, Service, FAQPage, Breadcrumb, Article)
│  │  │  ├─ whatsapp.ts         (monta link wa.me com mensagem por página)
│  │  │  └─ content.ts          (helpers de leitura do Keystatic)
│  │  ├─ pages-templates/       (templates de serviço, nicho, case, post)
│  │  └─ styles/base.css        (Tailwind + tokens padrão)
│  ├─ site/                     ← DO CLIENTE
│  │  ├─ theme.css              (cores, fontes e raios do cliente)
│  │  └─ logo.svg
│  ├─ content/                  ← DO CLIENTE (escrito pelo Keystatic)
│  │  ├─ settings/              (singleton: configurações gerais)
│  │  ├─ home/                  (singleton)
│  │  ├─ pages/                 (sobre, contato, privacidade, páginas livres)
│  │  ├─ services/
│  │  ├─ niches/
│  │  ├─ portfolio/
│  │  ├─ testimonials/
│  │  └─ posts/
│  └─ pages/                    ← rotas Astro (finas, só chamam templates do core)
│     ├─ index.astro
│     ├─ [slug].astro           (páginas livres: sobre, contato...)
│     ├─ servicos/[slug].astro
│     ├─ solucoes/[slug].astro  (nichos)
│     ├─ portfolio/index.astro + [slug].astro
│     ├─ blog/index.astro + [slug].astro
│     ├─ api/contato.ts
│     └─ 404.astro
```

---

## 4. Configuração do cliente

### 4.1 `src/site/theme.css` (dev controla)
```
--color-primary        #7C3AED
--color-primary-soft   #A78BFA
--color-dark           #140D24
--color-light          #F8F6FF
--color-text           #1E1B2E
--color-accent         #22D3EE
--font-heading         Space Grotesk
--font-body            Inter
--font-mono            JetBrains Mono
--radius               12px
```
Trocar essas ~10 variáveis muda a marca do site inteiro.

### 4.2 Singleton "Configurações" no Keystatic (cliente pode editar)
- Nome do site, slogan, logo (opcional, sobrescreve `logo.svg`)
- WhatsApp: número + mensagem padrão
- E-mail, telefone, endereço (opcional), CNPJ (opcional)
- Redes sociais (Instagram, LinkedIn, Facebook, YouTube...)
- Menu principal e colunas do rodapé
- SEO padrão: title template (`%s | bitCode`), description, imagem OG
- IDs: Cloudflare Analytics, GA4 (opcional), Meta Pixel (opcional)
- Interruptores: mostrar blog? mostrar portfólio? mostrar botão flutuante?

---

## 5. Blocos de página (o motor da replicação)

Cada bloco é um componente Astro + um esquema no Keystatic (`fields.blocks`). A home e as "páginas livres" são **listas de blocos** que o editor reordena no painel. Assim, cada cliente monta a página sem código novo.

| Bloco | Uso | Variações |
|---|---|---|
| `Hero` | Topo da página | escuro/claro · com imagem / com mockup / centralizado |
| `StatsBar` | Faixa de números | 3 ou 4 itens |
| `CardGrid` | Serviços, benefícios | com ícone / com link |
| `Features` | "Por que nós" | fundo escuro/claro |
| `PortfolioGrid` | Projetos | destaque (3) / filtro por categoria |
| `Steps` | Processo | 3 a 5 passos |
| `ChipLinks` | Nichos, tags | centralizado |
| `Testimonials` | Depoimentos | 2 ou 3 colunas |
| `Faq` | Perguntas | gera JSON-LD FAQPage automaticamente |
| `Cta` | Chamada final | violeta / escuro |
| `RichText` | Texto livre | — |
| `ImageText` | Imagem + texto | imagem à esquerda/direita |
| `Pains` | "A dor do cliente" | 3 itens |
| `Checklist` | "O que está incluso" | 1 ou 2 colunas |
| `ContactForm` | Formulário | com/sem WhatsApp ao lado |
| `Timeline` | Linha do tempo (Sobre) | — |

---

## 6. Modelo de conteúdo (Keystatic)

**Singletons**
- `settings`: item 4.2
- `home`: `blocks[]`

**Collections**

| Coleção | Campos principais |
|---|---|
| `pages` | título, slug, SEO (title, description, OG), `blocks[]` |
| `services` | título, slug, SEO, ativo (sim/não), ordem, ícone, resumo (para cards), mensagem do WhatsApp, `blocks[]` (template padrão: Hero → Pains → Checklist → ChipLinks → Steps → PortfolioGrid → Faq → Cta), relacionados[] |
| `niches` | igual a `services` + nicho, serviço base |
| `portfolio` | título, cliente, ano, categoria (site/landing/e-commerce/sistema), tecnologias[], link, selo Thunderweb, destaque, capa, galeria[], desafio, solução, resultado |
| `testimonials` | texto, nome, empresa, foto, serviço relacionado |
| `posts` | título, slug, data, autor, capa, resumo, tags[], SEO, conteúdo (Markdoc) |

Serviço com **ativo = não** não gera página nem aparece nos menus. É assim que e-commerce e sistemas ficam prontos, mas escondidos.

---

## 7. SEO técnico (embutido no core)

- `title`/`description`/canonical/OG/Twitter Card por página, com fallback do singleton
- `@astrojs/sitemap` + `robots.txt`
- JSON-LD: `ProfessionalService` (home), `Service` (serviços/nichos), `FAQPage`, `BreadcrumbList`, `Article` (blog)
- Imagens via `astro:assets` (AVIF/WebP, `width`/`height`, lazy)
- Fontes auto-hospedadas com `preload` da fonte do título
- HTML semântico: um H1 por página, hierarquia de headings
- Meta: Lighthouse **≥ 95** em todas as categorias, no celular
- Redirecionamentos (`_redirects`) para quem migra de um site antigo

---

## 8. Painel do cliente (Keystatic): ponto de atenção

- **Modo local** (`storage: local`): o desenvolvedor edita no próprio computador. Use durante o desenvolvimento.
- **Modo GitHub:** quem edita precisa de **conta no GitHub** com acesso ao repo. Funciona bem para você, mas é uma barreira para o cliente leigo.
- **Keystatic Cloud:** login simplificado para quem não usa GitHub. **Verificar planos e limites atuais na hora de implementar.**

Sugestão: o site da bitCode usa o modo GitHub. Para clientes, decidimos depois de testar o Keystatic Cloud. O cliente que não quiser editar entra no **plano de manutenção**, e você edita por ele.

---

## 9. Deploy

```
push na main ──► GitHub ──► Cloudflare Workers Builds ──► produção (bitcode.dev.br)
push em branch ─────────────────────────────────────────► URL de preview
edição no Keystatic ──► commit na main ──► (mesmo fluxo)
```

- DNS do domínio na Cloudflare (o domínio fica registrado no Registro.br)
- Variáveis secretas: chave do e-mail transacional, segredo do Turnstile, credenciais do Keystatic
- E-mail do domínio: Zoho Mail ou Google Workspace (registros MX na Cloudflare)

---

## 10. Checklist: novo cliente (meta: site base no ar em 1 dia)

1. [ ] Criar repo a partir do template e adicionar o remote `upstream`
2. [ ] Editar `src/site/theme.css` e `logo.svg` e gerar o favicon
3. [ ] Preencher o singleton Configurações (WhatsApp, redes, SEO)
4. [ ] Montar a home e as páginas com blocos
5. [ ] Cadastrar serviços, portfólio e depoimentos
6. [ ] Criar o projeto na Cloudflare e conectar o repo
7. [ ] Apontar o domínio, testar o SSL e o formulário
8. [ ] Search Console + sitemap + Analytics
9. [ ] Lighthouse ≥ 95 no celular
10. [ ] Configurar o acesso do cliente ao painel (ou plano de manutenção)

---

## 11. Fases de implementação

| Fase | Entrega |
|---|---|
| **F1: Fundação** | Projeto Astro + Tailwind, tokens, layouts, Header/Footer/WhatsApp, Logo, deploy de teste na Cloudflare |
| **F2: Blocos** | Todos os blocos da seção 5, home da bitCode montada com conteúdo fixo |
| **F3: Keystatic** | Esquemas, singletons e coleções; home e páginas lidas do conteúdo |
| **F4: Páginas** | Serviços, nichos, portfólio (lista + case), sobre, contato, blog, 404 |
| **F5: SEO e formulário** | JSON-LD, sitemap, OG, endpoint de contato + Turnstile, analytics |
| **F6: Lançamento** | Domínio bitcode.dev.br, Search Console, revisão final, Lighthouse |
| **F7: Starter** | Separar o starter limpo (sem conteúdo bitCode) como template + checklist testado com um "cliente fictício" |

> Dica: construir o site da bitCode **dentro** do starter desde o início (F1–F6) e só no fim separar o template (F7). Assim o starter nasce testado num site real.
