/**
 * CONFIGURAÇÕES DO SITE
 * Na Fase 3 estes dados passam para o painel (Keystatic, singleton "Configurações").
 * Até lá, edite aqui.
 */

export interface NavLink {
  label: string;
  href: string;
}

export interface SiteConfig {
  name: string;
  /** Nome dividido para o logo bicolor: "bit" + "Code" */
  logo: { first: string; second: string };
  tagline: string;
  description: string;
  locale: string;
  url: string;
  titleTemplate: string;
  whatsapp: { number: string; message: string };
  email: string;
  serviceArea: string;
  social: { label: string; href: string }[];
  nav: NavLink[];
  footer: { title: string; links: NavLink[] }[];
}

export const site: SiteConfig = {
  name: 'bitCode',
  logo: { first: 'bit', second: 'Code' },
  tagline: 'Agência digital. Sites, landing pages e SEO feitos com código de verdade.',
  description:
    'Agência digital com mais de 20 anos de experiência. Criamos sites rápidos, landing pages que convertem e estratégias de SEO para todo o Brasil.',
  locale: 'pt-BR',
  url: 'https://bitcode.dev.br',
  titleTemplate: '%s | bitCode',

  whatsapp: {
    // TODO: número real com DDI + DDD, só dígitos. Ex.: 5511999999999
    number: '5500000000000',
    message: 'Olá! Vim pelo site da bitCode e quero conversar sobre um projeto.',
  },
  email: 'contato@bitcode.dev.br',
  serviceArea: 'Atendimento em todo o Brasil',

  social: [
    // TODO: preencher quando os perfis existirem
    // { label: 'Instagram', href: 'https://instagram.com/...' },
  ],

  nav: [
    { label: 'Serviços', href: '/#servicos' },
    { label: 'Portfólio', href: '/portfolio' },
    { label: 'Sobre', href: '/sobre' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contato', href: '/contato' },
  ],

  footer: [
    {
      title: 'Serviços',
      links: [
        { label: 'Criação de sites', href: '/servicos/criacao-de-sites' },
        { label: 'Landing pages', href: '/servicos/landing-pages' },
        { label: 'SEO', href: '/servicos/seo' },
      ],
    },
    {
      title: 'Empresa',
      links: [
        { label: 'Sobre', href: '/sobre' },
        { label: 'Portfólio', href: '/portfolio' },
        { label: 'Blog', href: '/blog' },
        { label: 'Contato', href: '/contato' },
      ],
    },
  ],
};
