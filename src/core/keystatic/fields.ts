/** Campos reutilizáveis nos esquemas do Keystatic. */
import { fields } from '@keystatic/core';

/** Botão de ação: WhatsApp (com mensagem) ou link comum. */
export const actionField = (label: string) =>
  fields.object(
    {
      label: fields.text({ label: 'Texto do botão', description: 'Deixe vazio para não exibir o botão.' }),
      kind: fields.select({
        label: 'Tipo',
        options: [
          { label: 'Abrir WhatsApp', value: 'whatsapp' },
          { label: 'Link', value: 'link' },
        ],
        defaultValue: 'whatsapp',
      }),
      value: fields.text({
        label: 'Mensagem do WhatsApp ou endereço do link',
        description: 'WhatsApp: mensagem pré-preenchida (vazio = mensagem padrão). Link: ex. /portfolio ou https://...',
      }),
    },
    { label },
  );

export const toneField = (defaultValue: 'white' | 'light' | 'dark' = 'white') =>
  fields.select({
    label: 'Fundo',
    options: [
      { label: 'Branco', value: 'white' },
      { label: 'Lilás claro', value: 'light' },
      { label: 'Escuro', value: 'dark' },
    ],
    defaultValue,
  });

export const lightToneField = (defaultValue: 'white' | 'light' = 'white') =>
  fields.select({
    label: 'Fundo',
    options: [
      { label: 'Branco', value: 'white' },
      { label: 'Lilás claro', value: 'light' },
    ],
    defaultValue,
  });

export const seoFields = {
  seoTitle: fields.text({
    label: 'SEO: título',
    description: 'Até ~60 caracteres. Vazio = título da página.',
  }),
  seoDescription: fields.text({
    label: 'SEO: descrição',
    description: 'Até ~155 caracteres. Aparece no resultado do Google.',
    multiline: true,
  }),
};

export const titleTextItem = (titleLabel = 'Título', textLabel = 'Texto') =>
  fields.object({
    title: fields.text({ label: titleLabel }),
    text: fields.text({ label: textLabel, multiline: true }),
  });
