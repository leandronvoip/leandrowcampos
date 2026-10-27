/**
 * Utilidades de BUILD (rodam no Node, nunca no navegador) para saber se um
 * arquivo de public/ existe. Permite trocar placeholder por ativo real sem
 * mexer no código: basta colocar o arquivo na pasta.
 */
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

// O build do Astro roda com cwd na raiz do projeto (import.meta.url apontaria para dist/).
const publicDir = resolve(process.cwd(), 'public') + '/';

/** `publicFileExists('/images/capa.png')` → true se public/images/capa.png existir. */
export function publicFileExists(path: string): boolean {
  if (!path.startsWith('/')) return false;
  return existsSync(publicDir + path.slice(1));
}

/** Caminho da capa real de um e-book, se existir: public/images/capa-<slug>.png ou .jpg. */
export function realCoverFor(slug: string): string | null {
  for (const ext of ['png', 'jpg', 'webp']) {
    const path = `/images/capa-${slug}.${ext}`;
    if (publicFileExists(path)) return path;
  }
  return null;
}

/**
 * Decide a capa a exibir: a real, se existir em public/images; senão o `cover`
 * do frontmatter, desde que não seja o placeholder; senão null (livro em CSS).
 */
export function resolveCover(slug: string, cover: string): string | null {
  const real = realCoverFor(slug);
  if (real) return real;
  if (cover && !cover.includes('placeholder') && (cover.startsWith('http') || publicFileExists(cover))) return cover;
  return null;
}

/** Devolve o caminho se o arquivo existir; senão o fallback (ou null). */
export function pick(path: string, fallback: string | null = null): string | null {
  return publicFileExists(path) ? path : fallback;
}
