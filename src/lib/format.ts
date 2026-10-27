/** Formata número em reais: 47 -> "R$ 47,00" */
export function brl(value: number, opts: { cents?: boolean } = {}): string {
  const { cents = true } = opts;
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: cents ? 2 : 0,
    maximumFractionDigits: cents ? 2 : 0,
  });
}

/**
 * Fuso para exibir uma data. Datas só com dia (`2026-10-20` no frontmatter) viram
 * meia-noite UTC; mostradas em Brasília cairiam no dia anterior. Nesse caso o
 * dia é exibido em UTC; datas com horário usam o horário de Brasília.
 */
function zoneFor(d: Date): string {
  const dateOnly = d.getUTCHours() === 0 && d.getUTCMinutes() === 0 && d.getUTCSeconds() === 0;
  return dateOnly ? 'UTC' : 'America/Sao_Paulo';
}

/** Data longa em português: "10 de novembro de 2026" */
export function longDate(input: string | Date): string {
  const d = typeof input === 'string' ? new Date(input) : input;
  return d.toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: zoneFor(d),
  });
}

/** Data curta: "10/11/2026" */
export function shortDate(input: string | Date): string {
  const d = typeof input === 'string' ? new Date(input) : input;
  return d.toLocaleDateString('pt-BR', { timeZone: zoneFor(d) });
}
