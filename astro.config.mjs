// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  // Domínio canônico: usado no sitemap, no RSS, nas URLs canônicas e no Open Graph.
  site: 'https://leandrowcampos.com.br',
  // Saída 100% estática para a Cloudflare Pages (sem SSR / sem adaptador).
  output: 'static',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    sitemap({
      // Páginas de confirmação ficam fora do sitemap (também levam noindex).
      filter: (page) => !/\/(obrigado|comprou|404)\/?$/.test(page),
    }),
    mdx(),
  ],
});
