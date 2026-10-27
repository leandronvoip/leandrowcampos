# leandrowcampos.com.br

Site da marca pessoal **Leandro Campos**: o conhecimento de um empreendedor de quinze anos (empreendedorismo, tecnologia, marketing, financeiro, processos e gestão de pessoas) em conteúdo, cursos e consultoria. A IA é o tema da primeira série de e-books, não a base da marca. O domínio mantém o W (de Wesley, segundo nome) porque `leandrocampos.com.br` não estava livre; o nome exibido no site é sempre "Leandro Campos".
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
| Nome, bio, posicionamento (`description`, `tagline`), frentes (`topics`), números da Nvoip, isca gratuita (`leadMagnet`), datas do lançamento | `src/config/site.ts` |
| Cores, fontes, raio e sombra (tokens) e utilitários do sistema visual | `src/styles/global.css` (bloco `@theme`) |
| E-books (um arquivo por produto; o nome do arquivo é o slug) | `src/content/ebooks/*.mdx` |
| Posts do blog | `src/content/posts/*.md` |
| Esquema dos campos (o que é obrigatório em cada e-book/post) | `src/content.config.ts` |
| Páginas fixas (início, grátis, lançamento, sobre, privacidade, termos...) | `src/pages/*.astro` |
| Dados do responsável/vendedor nos textos legais | `src/config/legal.ts` |
| Página de venda (14 seções, ordem fixa) | `src/pages/ebook/[slug].astro` |
| Formulário de captura | `src/components/LeadForm.astro` |
| Pixel da Meta e GA4 | `src/components/Analytics.astro` |
| UTMs, cookie e eventos | `src/lib/tracking.ts` |
| Imagens públicas (retratos, capa, OG) | `public/images/` |
| Redirecionamentos e robots | `public/_redirects`, `public/robots.txt` |

Antes de publicar: `grep -rn PLACEHOLDER src public` deve devolver só o `checkoutUrl` do e-book (enquanto a URL da Hotmart não existir).

### Pré-lançamento e abertura do carrinho

`src/lib/launch.ts` decide, **no build**, o estado de venda de cada e-book: `open` quando a data do build é >= `cartOpens` e o `checkoutUrl` já é real; senão `prelaunch`. No pré-lançamento todos os botões de compra (página de venda, cartão da inicial, vitrine e banners do blog) viram "Entrar na lista de abertura" → `/lancamento`, com a linha "Abre em 10 de novembro às 9h · R$ 47 no lançamento"; o preço continua visível. Como o site é estático, **refaça o deploy** quando preencher o `checkoutUrl` e no dia da abertura (push ou "Retry deployment" na Cloudflare Pages).

### Blog

Posts com `draft: true` não aparecem na lista, no RSS, no sitemap nem geram página no build (em `npm run dev` aparecem, para conferir). Campos opcionais do frontmatter: `description`, `cover` (1200x630), `tags`, `updatedAt`. O banner do e-book (`EbookBanner.astro`) entra sozinho no artigo: antes do terceiro `##` (ou depois do 4º parágrafo, se não houver três títulos) e no fim; em artigo curto, só no fim. A regra fica em `src/lib/html-insert.ts`.

### Sistema visual

Escuro, sóbrio, com muito espaço e uma ideia por tela. Os tokens ficam no bloco `@theme` de `src/styles/global.css`:

| Token | Valor | Classe |
|---|---|---|
| Fundo | `#0A0A0C` | `bg-bg` |
| Superfície / elevada | `#121216` / `#1A1A20` | `bg-surface` / `bg-surface-2` |
| Linha | `rgba(255,255,255,0.08)` | `border-line` |
| Texto / secundário / apagado | `#F5F3EE` / `#A3A09A` / `#6B6965` | `text-ink` / `text-muted` / `text-dim` |
| Acento (dourado, só em rótulos, links e um detalhe por tela) | `#D4A857` | `text-accent` |

Tipografia pelo Google Fonts (`display=swap`, link em `src/layouts/Base.astro`): **Inter Tight** 500/600 nos títulos, **Inter** no texto.
Utilitários do sistema (definidos em `global.css`): `display-1/2/3` (títulos de tela), `eyebrow` (rótulo em versalete), `lead`, `measure`, `section-y`, `card`, `card-elevated`, `glow` (brilho radial atrás do herói), `reveal` (aparece na rolagem; `data-reveal-delay="120"` atrasa em ms) e a seção `pinned` (`src/components/Pinned.astro`).

Componentes de marca: `Logo.astro` (monograma inline + nome), `BookMockup.astro` (livro em CSS; usa a capa real quando ela existir), `Portrait.astro` (retrato vertical com vinheta). Os desenhos originais do logotipo ficam em `brand/logo/`.

Ícones: `Icon.astro` guarda um mapa de nomes para desenhos de linha (estilo Lucide/Feather, 24px, traço de 1.5px, `currentColor`), sem biblioteca. Uso: `<Icon name="message" />`. Ficam em `text-muted` e só ganham o dourado no primeiro item de uma lista ou no hover (`group-hover:text-accent`). Para um ícone novo, acrescente a entrada no mapa `paths`. Cada agente e cada "dor" do e-book declara o seu `icon` no frontmatter; as frentes do conteúdo declaram em `site.topics`.

### Fotos e capa

- Retratos em `public/images/`: `leandro-retrato.jpg` (herói e Sobre), `leandro-retrato-busto.jpg` (página de venda) e `leandro-perfil.jpg` (avatar e JSON-LD). Caminhos em `src/config/site.ts`.
- Capa do e-book: coloque `public/images/capa-<slug>.png` (ou `.jpg`/`.webp`) e o site passa a usá-la no lugar do livro em CSS, sem mexer em código (`src/lib/assets.ts`).

### Novo e-book

1. Copie `src/content/ebooks/ia-no-negocio.mdx` para `src/content/ebooks/<slug>.mdx`.
2. Preencha o frontmatter (o build falha se faltar campo obrigatório).
3. Coloque a capa em `public/images/capa-<slug>.png`; enquanto não existir, o site mostra o livro em CSS.
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
  components/             LeadForm, Button, Section, Pinned, Logo, Icon, BookMockup, Portrait, FAQ, cards...
  lib/assets.ts           existência de arquivos em public/ (capa e retrato reais)
  lib/tracking.ts         UTMs, cookie, eventos
  lib/format.ts           moeda e datas em pt-BR
  pages/                  rotas (index, ebooks, ebook/[slug], gratis, obrigado,
                          lancamento, newsletter, blog, blog/[slug], sobre,
                          privacidade, termos, comprou, 404, rss.xml)
  styles/global.css       Tailwind + tokens de design
public/
  _redirects  robots.txt  favicon.svg  images/
```
