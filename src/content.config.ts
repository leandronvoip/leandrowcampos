import { defineCollection } from 'astro:content';
import { z } from 'astro:schema';
import { glob } from 'astro/loaders';

/**
 * E-books: um arquivo .mdx por produto em src/content/ebooks/.
 * O nome do arquivo vira o slug da rota /ebook/[slug].
 */
const ebooks = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/ebooks' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
    /** Frase curta usada em cards e na meta description. */
    excerpt: z.string().max(200),
    /** Caminho em public/ ou URL absoluta da capa/mockup. */
    cover: z.string(),
    coverAlt: z.string().default('Capa do e-book'),
    price: z.number().positive(),
    originalPrice: z.number().positive().optional(),
    /** Texto livre de parcelamento, ex.: "ou 5x de R$ 9,88". */
    installments: z.string().optional(),
    pixDiscountText: z.string().optional(),
    checkoutUrl: z.string().url(),
    guaranteeDays: z.number().int().default(15),
    /** URL de embed do vídeo (YouTube/Vimeo). Vazio esconde a seção. */
    videoUrl: z.string().url().optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    publishedAt: z.coerce.date(),
    cartOpens: z.coerce.date().optional(),
    cartCloses: z.coerce.date().optional(),

    promise: z.object({
      headline: z.string(),
      support: z.string(),
      cta: z.string().default('Quero o e-book'),
    }),
    pains: z.array(z.object({ title: z.string(), text: z.string() })).length(3),
    chapters: z.array(z.object({ title: z.string(), result: z.string() })).min(1),
    agents: z.array(
      z.object({ name: z.string(), what: z.string(), icon: z.string().optional() }),
    ),
    caseStudy: z.object({
      title: z.string(),
      text: z.string(),
      metrics: z.array(z.object({ value: z.string(), label: z.string() })).min(1).max(4),
      disclaimer: z.string().optional(),
    }),
    forWho: z.array(z.string()).min(1),
    notForWho: z.array(z.string()).min(1),
    bonuses: z.array(
      z.object({ title: z.string(), description: z.string(), value: z.number().nonnegative() }),
    ),
    testimonials: z.array(
      z.object({ name: z.string(), role: z.string().optional(), text: z.string() }),
    ),
    faq: z.array(z.object({ q: z.string(), a: z.string() })).min(1),
  }),
});

/**
 * Blog: um arquivo .md/.mdx por post em src/content/posts/.
 */
const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(200),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    cover: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { ebooks, posts };
