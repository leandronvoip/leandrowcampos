# leandrowcampos.com.br

Site da marca pessoal **Leandro W. Campos**: e-books sobre IA aplicada a pequenas e médias empresas.
Astro + Tailwind, 100% estático, hospedado na Cloudflare Pages. Checkout e área de membros ficam na Hotmart; captura de leads vai para um webhook do n8n.

## Rodar localmente

```bash
npm install
cp .env.example .env     # preencha o que tiver (pode deixar vazio)
npm run dev              # http://localhost:4321
npm run build            # gera dist/
npm run preview          # serve dist/ para conferir
npm run check            # checagem de tipos
```

Requer Node 22.23+ (ver `engines` no `package.json`).

## Onde editar

| O quê | Onde |
|---|---|
| Nome, bio, links sociais, números da Nvoip, datas do lançamento | `src/config/site.ts` |
| Cores, fonte, raio e sombra (tokens) | `src/styles/global.css` (bloco `@theme`) |
| E-books (um arquivo por produto; o nome do arquivo é o slug) | `src/content/ebooks/*.mdx` |
| Posts do blog | `src/content/posts/*.md` |
| Esquema dos campos (o que é obrigatório em cada e-book/post) | `src/content.config.ts` |
| Páginas fixas (início, grátis, lançamento, sobre, privacidade, termos...) | `src/pages/*.astro` |
| Página de venda (14 seções, ordem fixa) | `src/pages/ebook/[slug].astro` |
| Formulário de captura | `src/components/LeadForm.astro` |
| Pixel da Meta e GA4 | `src/components/Analytics.astro` |
| UTMs, cookie e eventos | `src/lib/tracking.ts` |
| Imagens públicas (capa, foto, OG) | `public/images/` |
| Redirecionamentos e robots | `public/_redirects`, `public/robots.txt` |

Todo texto provisório está marcado com `[PLACEHOLDER]`. Antes de publicar: `grep -rn PLACEHOLDER src public`.

### Trocar a paleta

Edite os tokens em `src/styles/global.css`. As classes seguem o nome do token (`bg-brand-600`, `text-ink`, `border-line`, `bg-surface-alt`). Para usar uma fonte do Google, troque `--font-sans` e descomente o `<link>` em `src/layouts/Base.astro` (sempre com `display=swap`).

### Novo e-book

1. Copie `src/content/ebooks/ia-no-negocio.mdx` para `src/content/ebooks/<slug>.mdx`.
2. Preencha o frontmatter (o build falha se faltar campo obrigatório).
3. Coloque a capa em `public/images/` e aponte em `cover`.
4. `checkoutUrl` é a URL de checkout da Hotmart. O site só linka; não há integração.
5. Para destacar no início, defina `featured: true` e ajuste `launch.featuredEbook` em `src/config/site.ts`.

## Variáveis de ambiente

Todas são públicas (prefixo `PUBLIC_`), vão para o navegador e não devem conter segredo. Veja `.env.example`.

| Variável | Uso | Vazia |
|---|---|---|
| `PUBLIC_LEAD_WEBHOOK_URL` | URL do webhook (n8n) que recebe o POST JSON dos formulários | Formulário exibe erro de configuração |
| `PUBLIC_META_PIXEL_ID` | ID do Meta Pixel | Pixel não é carregado |
| `PUBLIC_GA4_ID` | ID do GA4 (`G-XXXX`) | GA4 não é carregado |

Na Cloudflare Pages: **Settings → Environment variables**, para Production e Preview. Depois de alterar, refaça o deploy (as variáveis entram no build).

### Payload do formulário

```json
{
  "nome": "Maria",
  "email": "maria@empresa.com.br",
  "whatsapp": "11999999999",
  "consentimentos": { "email": true, "whatsapp": false },
  "origem": "gratis",
  "pagina": "/gratis/",
  "url": "https://leandrowcampos.com.br/gratis/?utm_source=ig",
  "utms": { "utm_source": "ig", "landing": "/gratis/", "referrer": "", "first_seen": "2026-10-26T20:00:00.000Z" },
  "enviado_em": "2026-10-26T20:01:00.000Z"
}
```

O webhook deve responder 2xx. O site não guarda nada além do cookie `lwc_utm` (UTMs, 30 dias).

### Eventos de rastreamento

- `PageView` / `page_view`: automático quando o pixel/GA4 está ativo.
- `ViewContent` / `view_item`: na página de venda, com `content_ids`, `value` e `currency`.
- `InitiateCheckout` / `begin_checkout`: clique em qualquer botão de compra.
- `Lead` / `generate_lead`: envio do formulário com sucesso.
- `Purchase` não é disparado pelo site: deve vir do webhook da Hotmart (servidor).

## Publicar na Cloudflare Pages

1. Suba este repositório para o GitHub (ou GitLab).
2. Cloudflare → **Workers & Pages → Create → Pages → Connect to Git** e escolha o repositório.
3. Configuração do build:
   - Framework preset: **Astro**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Node: defina a variável `NODE_VERSION` = `22` (ou superior) se o padrão for menor.
4. Cadastre as variáveis `PUBLIC_*` acima.
5. Após o primeiro deploy, em **Custom domains** adicione `leandrowcampos.com.br` (a zona já está na Cloudflare; o registro DNS é criado automaticamente).
6. Para o `.com` redirecionar ao `.com.br`: ou adicione `leandrowcampos.com` e `www.leandrowcampos.com` como domínios do mesmo projeto (o `public/_redirects` cuida do 301), ou mantenha a Redirect Rule já existente na zona do `.com`.
7. Na Hotmart, configure `https://leandrowcampos.com.br/comprou` como página de obrigado do produto.

Cada push na branch principal gera um deploy de produção; outras branches geram previews.

## Estrutura

```
src/
  config/site.ts          dados da marca e do lançamento
  content.config.ts       esquemas das coleções (ebooks, posts)
  content/ebooks/         um .mdx por e-book
  content/posts/          um .md por post
  layouts/Base.astro      <head>, SEO, OG, analytics, header/footer
  components/             LeadForm, Button, Section, FAQ, cards...
  lib/tracking.ts         UTMs, cookie, eventos
  lib/format.ts           moeda e datas em pt-BR
  pages/                  rotas (index, ebooks, ebook/[slug], gratis, obrigado,
                          lancamento, newsletter, blog, blog/[slug], sobre,
                          privacidade, termos, comprou, 404, rss.xml)
  styles/global.css       Tailwind + tokens de design
public/
  _redirects  robots.txt  favicon.svg  images/
```
