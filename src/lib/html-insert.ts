/**
 * Divide o HTML de um artigo no ponto onde entra o banner do meio do texto.
 *
 * Regra: antes do terceiro <h2> de nível superior (isto é, depois da seção
 * aberta pelo segundo <h2>). Sem três <h2>, depois do quarto <p> de nível
 * superior. Se nem isso existir (artigo curto), não há ponto de inserção e o
 * banner do meio é omitido: só o do fim do artigo aparece.
 *
 * "Nível superior" significa fora de listas, citações, tabelas etc., para o
 * banner nunca cair dentro de outro elemento e quebrar a marcação.
 */

const VOID_TAGS = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr',
]);

interface Marker {
  /** Posição no HTML (índice do caractere) onde o banner pode entrar. */
  index: number;
  kind: 'h2' | 'p';
}

/** Elementos de bloco que fecham um <p> aberto, como o navegador faz. */
const CLOSES_P = new Set([
  'address', 'article', 'aside', 'blockquote', 'div', 'dl', 'fieldset', 'figure', 'footer', 'form',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'hr', 'main', 'nav', 'ol', 'p', 'pre', 'section', 'table', 'ul',
]);

/**
 * Percorre as tags e devolve os pontos de inserção possíveis, na ordem do texto.
 * Usa uma pilha de elementos abertos; tag de fechamento sem par é ignorada e
 * <p> aberto é fechado por bloco seguinte, para uma marcação imperfeita no
 * Markdown não "engolir" o resto do artigo.
 */
export function topLevelMarkers(html: string): Marker[] {
  const markers: Marker[] = [];
  const tagRe = /<!--[\s\S]*?-->|<\/?([a-zA-Z][\w:-]*)[^>]*?>/g;
  const stack: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = tagRe.exec(html)) !== null) {
    const [raw, name] = match;
    if (!name) continue; // comentário
    const tag = name.toLowerCase();
    const isClosing = raw.startsWith('</');
    if (isClosing) {
      const open = stack.lastIndexOf(tag);
      if (open === -1) continue; // fechamento sem abertura: ignora
      stack.length = open; // fecha também o que ficou aberto dentro
      if (stack.length === 0 && tag === 'p') markers.push({ index: match.index + raw.length, kind: 'p' });
      continue;
    }
    if (CLOSES_P.has(tag) && stack[stack.length - 1] === 'p') stack.pop();
    if (stack.length === 0 && tag === 'h2') markers.push({ index: match.index, kind: 'h2' });
    const selfClosing = raw.endsWith('/>') || VOID_TAGS.has(tag);
    if (!selfClosing) stack.push(tag);
  }
  return markers;
}

export interface SplitResult {
  before: string;
  /** null quando não há ponto de inserção (artigo curto). */
  after: string | null;
}

export function splitForBanner(html: string, opts: { afterH2?: number; afterParagraph?: number } = {}): SplitResult {
  const { afterH2 = 2, afterParagraph = 4 } = opts;
  const markers = topLevelMarkers(html);
  const h2s = markers.filter((m) => m.kind === 'h2');
  const ps = markers.filter((m) => m.kind === 'p');

  let at: number | null = null;
  if (h2s.length > afterH2) at = h2s[afterH2].index; // antes do terceiro h2
  else if (ps.length > afterParagraph) at = ps[afterParagraph - 1].index; // depois do quarto parágrafo

  if (at === null) return { before: html, after: null };
  const after = html.slice(at);
  // Não vale a pena cortar se o que sobra depois é só um fecho curto: o banner final já cobre.
  if (after.replace(/<[^>]+>/g, '').trim().length < 200) return { before: html, after: null };
  return { before: html.slice(0, at), after };
}
