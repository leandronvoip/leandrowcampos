/**
 * Utilidades de rastreamento usadas no NAVEGADOR (importadas em <script> dos componentes).
 * - UTMs: lidas da URL e guardadas em cookie de primeira parte por 30 dias.
 * - track(): envia evento para Meta Pixel e GA4 quando estiverem carregados.
 */

export const UTM_COOKIE = 'lwc_utm';
export const UTM_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'fbclid',
  'gclid',
] as const;

export type UtmKey = (typeof UTM_KEYS)[number];
export type Utms = Partial<Record<UtmKey, string>> & {
  landing?: string;
  referrer?: string;
  first_seen?: string;
};

function readCookie(name: string): string | null {
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith(name + '='));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : null;
}

function writeCookie(name: string, value: string, days: number): void {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  const secure = location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${name}=${encodeURIComponent(value)}; Expires=${expires}; Path=/; SameSite=Lax${secure}`;
}

/** Lê o cookie de UTMs (ou objeto vazio). */
export function getStoredUtms(): Utms {
  try {
    const raw = readCookie(UTM_COOKIE);
    return raw ? (JSON.parse(raw) as Utms) : {};
  } catch {
    return {};
  }
}

/**
 * Captura UTMs da URL atual. Se houver alguma, sobrescreve o cookie
 * (último clique vence). Se não houver, mantém o que já estava guardado.
 */
export function captureUtms(): Utms {
  const params = new URLSearchParams(location.search);
  const found: Utms = {};
  for (const key of UTM_KEYS) {
    const v = params.get(key);
    if (v) found[key] = v.slice(0, 200);
  }
  const stored = getStoredUtms();
  if (Object.keys(found).length === 0) return stored;

  const merged: Utms = {
    ...found,
    landing: location.pathname,
    referrer: document.referrer ? document.referrer.slice(0, 300) : undefined,
    first_seen: new Date().toISOString(),
  };
  writeCookie(UTM_COOKIE, JSON.stringify(merged), 30);
  return merged;
}

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

/**
 * Dispara um evento nos dois rastreadores, se existirem.
 * Nomes conhecidos pelo Meta (ViewContent, Lead, ...) são enviados com `track`;
 * para o GA4 traduzimos para o nome recomendado quando houver equivalente.
 */
export function track(name: string, params: Record<string, unknown> = {}): void {
  const metaStandard = new Set([
    'PageView', 'ViewContent', 'Lead', 'CompleteRegistration', 'InitiateCheckout',
    'AddToCart', 'Purchase', 'Contact', 'Subscribe',
  ]);
  if (typeof window.fbq === 'function') {
    window.fbq(metaStandard.has(name) ? 'track' : 'trackCustom', name, params);
  }
  if (typeof window.gtag === 'function') {
    const ga4Names: Record<string, string> = {
      ViewContent: 'view_item',
      Lead: 'generate_lead',
      InitiateCheckout: 'begin_checkout',
      Purchase: 'purchase',
    };
    window.gtag('event', ga4Names[name] ?? name, params);
  }
}

/**
 * Anexa a origem (UTMs) aos links de checkout da Hotmart.
 * A Hotmart aceita `src` (origem) e `sck` (rastreio livre) na URL de checkout.
 */
export function decorateCheckoutLinks(selector = 'a[data-checkout]'): void {
  const utms = getStoredUtms();
  const src = utms.utm_source
    ? [utms.utm_source, utms.utm_medium, utms.utm_campaign].filter(Boolean).join('_')
    : '';
  const sck = utms.utm_content || utms.utm_term || '';
  if (!src && !sck) return;

  document.querySelectorAll<HTMLAnchorElement>(selector).forEach((a) => {
    try {
      const url = new URL(a.href);
      if (src && !url.searchParams.has('src')) url.searchParams.set('src', src.slice(0, 100));
      if (sck && !url.searchParams.has('sck')) url.searchParams.set('sck', sck.slice(0, 100));
      a.href = url.toString();
    } catch {
      /* link relativo ou inválido: ignora */
    }
  });
}
