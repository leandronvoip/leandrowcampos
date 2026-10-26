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

/** Data longa em português: "10 de novembro de 2026" */
export function longDate(input: string | Date): string {
  const d = typeof input === 'string' ? new Date(input) : input;
  return d.toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'America/Sao_Paulo',
  });
}

/** Data curta: "10/11/2026" */
export function shortDate(input: string | Date): string {
  const d = typeof input === 'string' ? new Date(input) : input;
  return d.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });
}
