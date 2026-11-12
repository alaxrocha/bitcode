/** Tipos compartilhados pelos blocos de página. */

export type Tone = 'white' | 'light' | 'dark' | 'primary';

/** Botão/link de ação. Se `whatsapp` for informado, vira link do WhatsApp com essa mensagem. */
export interface Action {
  label: string;
  href?: string;
  whatsapp?: string;
}

export interface CardItem {
  icon?: string;
  title: string;
  text: string;
  href?: string;
  linkLabel?: string;
}

export interface FeatureItem {
  title: string;
  text: string;
}

export interface StatItem {
  value: string;
  label: string;
}

export interface StepItem {
  title: string;
  text: string;
}

export interface ChipItem {
  label: string;
  href: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  company?: string;
  photo?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface PortfolioItem {
  title: string;
  category: string;
  year?: string;
  href?: string;
  image?: string;
  thunderweb?: boolean;
}
