/**
 * Estado de venda de um e-book, decidido NO BUILD (site 100% estático).
 *
 * - 'open': a data do build é >= `cartOpens` (do e-book ou de `site.launch`) e o
 *   `checkoutUrl` já é real (não contém a palavra "placeholder", em qualquer caixa).
 * - 'prelaunch': qualquer outro caso. Os botões de compra viram "Entrar na lista
 *   de abertura" (→ /lancamento) e a página de venda segue mostrando o preço.
 *
 * Como a decisão é no build, o site precisa de um novo deploy depois que a URL
 * de checkout for preenchida e no dia da abertura (um push ou "Retry deployment"
 * na Cloudflare Pages resolve).
 */
import { site } from '../config/site';
import { brl } from './format';

export type SaleState = 'open' | 'prelaunch';

/** O mínimo que a função precisa de um e-book (serve a entrada da coleção ou só o `data`). */
export interface SaleInput {
  data: {
    checkoutUrl: string;
    price: number;
    cartOpens?: Date;
    cartCloses?: Date;
  };
}

/** URL provisória de checkout: qualquer URL que contenha a palavra reservada (caixa indiferente). */
const PROVISIONAL_URL = /placeholder/i;

/** Data/hora de abertura do carrinho do e-book (ou a do lançamento em `site.launch`). */
export function cartOpensAt(ebook: SaleInput): Date {
  return ebook.data.cartOpens ?? new Date(site.launch.cartOpens);
}

export function saleState(ebook: SaleInput, now: Date = new Date()): SaleState {
  const hasRealCheckout = !PROVISIONAL_URL.test(ebook.data.checkoutUrl);
  return now.getTime() >= cartOpensAt(ebook).getTime() && hasRealCheckout ? 'open' : 'prelaunch';
}

/** "10 de novembro" */
export function openingDay(ebook: SaleInput): string {
  return cartOpensAt(ebook).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    timeZone: 'America/Sao_Paulo',
  });
}

/** "9h" ou "9h30" */
export function openingHour(ebook: SaleInput): string {
  const parts = new Intl.DateTimeFormat('pt-BR', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: false,
    timeZone: 'America/Sao_Paulo',
  }).formatToParts(cartOpensAt(ebook));
  const hour = Number(parts.find((p) => p.type === 'hour')?.value ?? '0');
  const minute = parts.find((p) => p.type === 'minute')?.value ?? '00';
  return minute === '00' ? `${hour}h` : `${hour}h${minute}`;
}

/** Linha pequena sob o botão de pré-lançamento: "Abre em 10 de novembro às 9h · R$ 47 no lançamento". */
export function prelaunchLine(ebook: SaleInput): string {
  return `Abre em ${openingDay(ebook)} às ${openingHour(ebook)} · ${brl(ebook.data.price, { cents: false })} no lançamento`;
}

/** Texto do botão de pré-lançamento. */
export const PRELAUNCH_CTA = 'Entrar na lista de abertura';
/** Destino do botão de pré-lançamento. */
export const PRELAUNCH_HREF = '/lancamento';
