/**
 * Esquema do painel (Keystatic). Parte do core: não editar por cliente.
 * Painel: http://127.0.0.1:4321/keystatic
 */
import { collection, config, fields, singleton } from '@keystatic/core';
import { pageBlocks } from './src/core/keystatic/blocks';
import { seoFields } from './src/core/keystatic/fields';

// Local durante o desenvolvimento. Em produção (Fase 6) definir
// PUBLIC_KEYSTATIC_STORAGE=github e PUBLIC_KEYSTATIC_REPO=dono/repo.
const storage =
  import.meta.env.PUBLIC_KEYSTATIC_STORAGE === 'github'
    ? ({ kind: 'github', repo: import.meta.env.PUBLIC_KEYSTATIC_REPO as `${string}/${string}` } as const)
    : ({ kind: 'local' } as const);

const serviceSchema = {
  title: fields.slug({ name: { label: 'Nome' } }),
  active: fields.checkbox({
    label: 'Publicado',
    description: 'Desmarcado: não gera página nem aparece nos menus.',
    defaultValue: true,
  }),
  order: fields.integer({ label: 'Ordem', defaultValue: 10 }),
  icon: fields.text({ label: 'Ícone do card (texto curto, ex.: </>)' }),
  summary: fields.text({ label: 'Resumo (usado nos cards)', multiline: true }),
  whatsappMessage: fields.text({ label: 'Mensagem do WhatsApp nesta página' }),
  ...seoFields,
  blocks: pageBlocks,
};

export default config({
  storage,
  ui: {
    brand: { name: 'bitCode' },
    navigation: {
      Site: ['settings', 'home', 'pages'],
      Serviços: ['services', 'niches'],
      Portfólio: ['portfolio', 'testimonials'],
      Blog: ['posts'],
    },
  },

  singletons: {
    settings: singleton({
      label: 'Configurações',
      path: 'src/content/settings',
      format: { data: 'yaml' },
      schema: {
        name: fields.text({ label: 'Nome do site', validation: { isRequired: true } }),
        logoFirst: fields.text({ label: 'Logo: primeira parte (ex.: bit)' }),
        logoSecond: fields.text({ label: 'Logo: segunda parte, colorida (ex.: Code)' }),
        tagline: fields.text({ label: 'Assinatura curta (rodapé)', multiline: true }),
        description: fields.text({ label: 'Descrição padrão (SEO)', multiline: true }),
        titleTemplate: fields.text({ label: 'Modelo de título', description: '%s = título da página', defaultValue: '%s | bitCode' }),
        homeTitle: fields.text({ label: 'Título da home (SEO)' }),
        url: fields.url({ label: 'Endereço do site' }),
        whatsappNumber: fields.text({ label: 'WhatsApp', description: 'DDI + DDD + número, só dígitos. Ex.: 5511999999999' }),
        whatsappMessage: fields.text({ label: 'Mensagem padrão do WhatsApp', multiline: true }),
        email: fields.text({ label: 'E-mail' }),
        serviceArea: fields.text({ label: 'Área de atendimento' }),
        social: fields.array(
          fields.object({ label: fields.text({ label: 'Rede' }), href: fields.url({ label: 'Endereço' }) }),
          { label: 'Redes sociais', itemLabel: (p) => p.fields.label.value || 'Rede' },
        ),
        nav: fields.array(
          fields.object({ label: fields.text({ label: 'Texto' }), href: fields.text({ label: 'Link' }) }),
          { label: 'Menu principal', itemLabel: (p) => p.fields.label.value || 'Item' },
        ),
        footer: fields.array(
          fields.object({
            title: fields.text({ label: 'Título da coluna' }),
            links: fields.array(
              fields.object({ label: fields.text({ label: 'Texto' }), href: fields.text({ label: 'Link' }) }),
              { label: 'Links', itemLabel: (p) => p.fields.label.value || 'Link' },
            ),
          }),
          { label: 'Colunas do rodapé', itemLabel: (p) => p.fields.title.value || 'Coluna' },
        ),
      },
    }),

    home: singleton({
      label: 'Página inicial',
      path: 'src/content/home',
      format: { data: 'yaml' },
      schema: {
        ...seoFields,
        blocks: pageBlocks,
      },
    }),
  },

  collections: {
    pages: collection({
      label: 'Páginas',
      path: 'src/content/pages/*',
      slugField: 'title',
      format: { data: 'yaml' },
      schema: {
        title: fields.slug({ name: { label: 'Título' } }),
        whatsappMessage: fields.text({ label: 'Mensagem do WhatsApp nesta página' }),
        ...seoFields,
        blocks: pageBlocks,
      },
    }),

    services: collection({
      label: 'Serviços',
      path: 'src/content/services/*',
      slugField: 'title',
      format: { data: 'yaml' },
      columns: ['order'],
      schema: serviceSchema,
    }),

    niches: collection({
      label: 'Soluções por nicho',
      path: 'src/content/niches/*',
      slugField: 'title',
      format: { data: 'yaml' },
      schema: serviceSchema,
    }),

    portfolio: collection({
      label: 'Projetos',
      path: 'src/content/portfolio/*',
      slugField: 'title',
      format: { data: 'yaml' },
      columns: ['year', 'category'],
      schema: {
        title: fields.slug({ name: { label: 'Nome do projeto' } }),
        client: fields.text({ label: 'Cliente' }),
        year: fields.text({ label: 'Ano' }),
        category: fields.select({
          label: 'Categoria',
          options: [
            { label: 'Site', value: 'site' },
            { label: 'Landing page', value: 'landing' },
            { label: 'E-commerce', value: 'ecommerce' },
            { label: 'Sistema', value: 'sistema' },
          ],
          defaultValue: 'site',
        }),
        featured: fields.checkbox({ label: 'Destaque na home', defaultValue: false }),
        thunderweb: fields.checkbox({ label: 'Projeto Thunderweb (selo)', defaultValue: false }),
        technologies: fields.array(fields.text({ label: 'Tecnologia' }), {
          label: 'Tecnologias',
          itemLabel: (p) => p.value || 'Tecnologia',
        }),
        link: fields.url({ label: 'Link do site (opcional)' }),
        cover: fields.image({
          label: 'Imagem de capa',
          directory: 'public/images/portfolio',
          publicPath: '/images/portfolio/',
        }),
        gallery: fields.array(
          fields.image({ label: 'Imagem', directory: 'public/images/portfolio', publicPath: '/images/portfolio/' }),
          { label: 'Galeria' },
        ),
        challenge: fields.text({ label: 'Desafio', multiline: true }),
        solution: fields.text({ label: 'Solução', multiline: true }),
        result: fields.text({ label: 'Resultado', multiline: true }),
      },
    }),

    testimonials: collection({
      label: 'Depoimentos',
      path: 'src/content/testimonials/*',
      slugField: 'name',
      format: { data: 'yaml' },
      schema: {
        name: fields.slug({ name: { label: 'Nome' } }),
        company: fields.text({ label: 'Empresa' }),
        quote: fields.text({ label: 'Depoimento', multiline: true }),
        photo: fields.image({
          label: 'Foto',
          directory: 'public/images/testimonials',
          publicPath: '/images/testimonials/',
        }),
        featured: fields.checkbox({ label: 'Mostrar na home', defaultValue: true }),
      },
    }),

    posts: collection({
      label: 'Posts',
      path: 'src/content/posts/*',
      slugField: 'title',
      format: { contentField: 'content' },
      entryLayout: 'content',
      columns: ['date'],
      schema: {
        title: fields.slug({ name: { label: 'Título' } }),
        date: fields.date({ label: 'Data de publicação', defaultValue: { kind: 'today' } }),
        summary: fields.text({ label: 'Resumo', multiline: true }),
        cover: fields.image({ label: 'Capa', directory: 'public/images/blog', publicPath: '/images/blog/' }),
        tags: fields.array(fields.text({ label: 'Tag' }), { label: 'Tags', itemLabel: (p) => p.value || 'Tag' }),
        ...seoFields,
        content: fields.markdoc({ label: 'Conteúdo' }),
      },
    }),
  },
});
