/**
 * Blocos de página editáveis no painel.
 * Cada chave corresponde a um componente em src/core/components/blocks
 * e é renderizada por BlockRenderer.astro.
 */
import { fields } from '@keystatic/core';
import { actionField, lightToneField, titleTextItem, toneField } from './fields';

const heading = {
  eyebrow: fields.text({ label: 'Rótulo (ex.: serviços)', description: 'Aparece como "// rótulo" acima do título.' }),
  title: fields.text({ label: 'Título' }),
  text: fields.text({ label: 'Subtítulo', multiline: true }),
};

export const pageBlocks = fields.blocks(
  {
    hero: {
      label: 'Topo (hero)',
      itemLabel: (p) => `Topo: ${p.fields.title.value || '…'}`,
      schema: fields.object({
        eyebrow: fields.text({ label: 'Sobretítulo', description: 'Ex.: <agência digital />' }),
        title: fields.text({ label: 'Título (H1)' }),
        highlight: fields.text({ label: 'Final do título em destaque', description: 'Ex.: vender.' }),
        text: fields.text({ label: 'Subtítulo', multiline: true }),
        primary: actionField('Botão principal'),
        secondary: actionField('Botão secundário'),
        visual: fields.select({
          label: 'Ilustração',
          options: [
            { label: 'Navegador com métricas', value: 'mockup' },
            { label: 'Nenhuma (texto centralizado)', value: 'none' },
          ],
          defaultValue: 'mockup',
        }),
      }),
    },

    stats: {
      label: 'Faixa de números',
      itemLabel: () => 'Faixa de números',
      schema: fields.object({
        items: fields.array(
          fields.object({
            value: fields.text({ label: 'Valor (ex.: +20 anos)' }),
            label: fields.text({ label: 'Legenda' }),
          }),
          { label: 'Números', itemLabel: (p) => p.fields.value.value || 'Número' },
        ),
      }),
    },

    servicesGrid: {
      label: 'Serviços (automático)',
      itemLabel: (p) => `Serviços: ${p.fields.title.value || '…'}`,
      schema: fields.object({
        ...heading,
        anchor: fields.text({ label: 'Âncora (id)', description: 'Ex.: servicos, para links /#servicos', defaultValue: 'servicos' }),
        footnote: fields.text({
          label: 'Linha final',
          description: 'Aceita <strong> e <a href="...">.',
          multiline: true,
        }),
      }),
    },

    cardGrid: {
      label: 'Cards',
      itemLabel: (p) => `Cards: ${p.fields.title.value || '…'}`,
      schema: fields.object({
        ...heading,
        tone: lightToneField(),
        items: fields.array(
          fields.object({
            icon: fields.text({ label: 'Ícone (texto curto, ex.: </>)' }),
            title: fields.text({ label: 'Título' }),
            text: fields.text({ label: 'Texto', multiline: true }),
            href: fields.text({ label: 'Link (opcional)' }),
          }),
          { label: 'Cards', itemLabel: (p) => p.fields.title.value || 'Card' },
        ),
      }),
    },

    features: {
      label: 'Diferenciais',
      itemLabel: (p) => `Diferenciais: ${p.fields.title.value || '…'}`,
      schema: fields.object({
        ...heading,
        tone: toneField('dark'),
        items: fields.array(titleTextItem(), {
          label: 'Itens',
          itemLabel: (p) => p.fields.title.value || 'Item',
        }),
      }),
    },

    portfolio: {
      label: 'Portfólio (automático)',
      itemLabel: (p) => `Portfólio: ${p.fields.title.value || '…'}`,
      schema: fields.object({
        ...heading,
        tone: lightToneField(),
        only: fields.select({
          label: 'Quais projetos',
          options: [
            { label: 'Só os marcados como destaque', value: 'featured' },
            { label: 'Todos', value: 'all' },
          ],
          defaultValue: 'featured',
        }),
        category: fields.select({
          label: 'Filtrar por categoria',
          options: [
            { label: 'Todas', value: '' },
            { label: 'Site', value: 'site' },
            { label: 'Landing page', value: 'landing' },
            { label: 'E-commerce', value: 'ecommerce' },
            { label: 'Sistema', value: 'sistema' },
          ],
          defaultValue: '',
        }),
        limit: fields.integer({ label: 'Quantidade máxima', defaultValue: 3 }),
        more: actionField('Botão "ver mais"'),
      }),
    },

    steps: {
      label: 'Passos (processo)',
      itemLabel: (p) => `Passos: ${p.fields.title.value || '…'}`,
      schema: fields.object({
        ...heading,
        tone: lightToneField('light'),
        items: fields.array(titleTextItem(), {
          label: 'Passos',
          itemLabel: (p) => p.fields.title.value || 'Passo',
        }),
      }),
    },

    chips: {
      label: 'Links em etiquetas',
      itemLabel: (p) => `Etiquetas: ${p.fields.title.value || '…'}`,
      schema: fields.object({
        title: fields.text({ label: 'Título' }),
        text: fields.text({ label: 'Subtítulo', multiline: true }),
        tone: lightToneField(),
        items: fields.array(
          fields.object({
            label: fields.text({ label: 'Texto' }),
            href: fields.text({ label: 'Link' }),
          }),
          { label: 'Etiquetas', itemLabel: (p) => p.fields.label.value || 'Etiqueta' },
        ),
      }),
    },

    testimonials: {
      label: 'Depoimentos (automático)',
      itemLabel: (p) => `Depoimentos: ${p.fields.title.value || '…'}`,
      schema: fields.object({
        eyebrow: heading.eyebrow,
        title: heading.title,
        tone: lightToneField('light'),
        limit: fields.integer({ label: 'Quantidade máxima', defaultValue: 2 }),
      }),
    },

    faq: {
      label: 'Perguntas frequentes',
      itemLabel: () => 'Perguntas frequentes',
      schema: fields.object({
        title: fields.text({ label: 'Título', defaultValue: 'Perguntas frequentes' }),
        tone: lightToneField(),
        items: fields.array(
          fields.object({
            question: fields.text({ label: 'Pergunta' }),
            answer: fields.text({ label: 'Resposta', multiline: true }),
          }),
          { label: 'Perguntas', itemLabel: (p) => p.fields.question.value || 'Pergunta' },
        ),
      }),
    },

    pains: {
      label: 'Dores do cliente',
      itemLabel: (p) => `Dores: ${p.fields.title.value || '…'}`,
      schema: fields.object({
        title: fields.text({ label: 'Título' }),
        tone: lightToneField(),
        items: fields.array(titleTextItem(), {
          label: 'Dores',
          itemLabel: (p) => p.fields.title.value || 'Dor',
        }),
      }),
    },

    checklist: {
      label: 'Lista "o que está incluso"',
      itemLabel: (p) => `Lista: ${p.fields.title.value || '…'}`,
      schema: fields.object({
        title: fields.text({ label: 'Título' }),
        tone: lightToneField('light'),
        items: fields.array(fields.text({ label: 'Item' }), {
          label: 'Itens',
          itemLabel: (p) => p.value || 'Item',
        }),
      }),
    },

    richText: {
      label: 'Texto',
      itemLabel: (p) => `Texto: ${p.fields.title.value || p.fields.body.value.slice(0, 40) || '…'}`,
      schema: fields.object({
        eyebrow: heading.eyebrow,
        title: fields.text({ label: 'Título (opcional)' }),
        tone: lightToneField(),
        body: fields.text({
          label: 'Texto',
          description: 'Markdown: ## subtítulo, **negrito**, - lista, [link](/endereco)',
          multiline: true,
        }),
      }),
    },

    imageText: {
      label: 'Imagem + texto',
      itemLabel: (p) => `Imagem + texto: ${p.fields.title.value || '…'}`,
      schema: fields.object({
        eyebrow: heading.eyebrow,
        title: fields.text({ label: 'Título' }),
        tone: lightToneField(),
        body: fields.text({ label: 'Texto (Markdown)', multiline: true }),
        image: fields.image({ label: 'Imagem', directory: 'public/images/pages', publicPath: '/images/pages/' }),
        imageAlt: fields.text({ label: 'Descrição da imagem (acessibilidade)' }),
        imageSide: fields.select({
          label: 'Lado da imagem',
          options: [
            { label: 'Esquerda', value: 'left' },
            { label: 'Direita', value: 'right' },
          ],
          defaultValue: 'left',
        }),
        action: actionField('Botão (opcional)'),
      }),
    },

    timeline: {
      label: 'Linha do tempo',
      itemLabel: (p) => `Linha do tempo: ${p.fields.title.value || '…'}`,
      schema: fields.object({
        eyebrow: heading.eyebrow,
        title: fields.text({ label: 'Título' }),
        tone: toneField('dark'),
        items: fields.array(
          fields.object({
            year: fields.text({ label: 'Ano / período' }),
            title: fields.text({ label: 'Título' }),
            text: fields.text({ label: 'Texto', multiline: true }),
          }),
          { label: 'Marcos', itemLabel: (p) => `${p.fields.year.value} ${p.fields.title.value}`.trim() || 'Marco' },
        ),
      }),
    },

    contactForm: {
      label: 'Formulário de contato',
      itemLabel: (p) => `Formulário: ${p.fields.title.value || '…'}`,
      schema: fields.object({
        title: fields.text({ label: 'Título' }),
        text: fields.text({ label: 'Texto', multiline: true }),
        tone: lightToneField(),
      }),
    },

    cta: {
      label: 'Chamada final',
      itemLabel: (p) => `Chamada: ${p.fields.title.value || '…'}`,
      schema: fields.object({
        title: fields.text({ label: 'Título' }),
        text: fields.text({ label: 'Subtítulo', multiline: true }),
        tone: fields.select({
          label: 'Fundo',
          options: [
            { label: 'Violeta', value: 'primary' },
            { label: 'Escuro', value: 'dark' },
          ],
          defaultValue: 'primary',
        }),
        action: actionField('Botão'),
        anchor: fields.text({ label: 'Âncora (id)', defaultValue: 'contato' }),
      }),
    },
  },
  { label: 'Blocos da página' },
);
