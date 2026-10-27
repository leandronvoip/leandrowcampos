/**
 * Posts publicados: rascunhos (`draft: true`) ficam fora da lista, do RSS, do
 * sitemap e das rotas no build. Em `npm run dev` os rascunhos aparecem, para
 * conferir o artigo antes de publicar.
 */
import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

export function isPublished(post: Post, includeDrafts = import.meta.env.DEV): boolean {
  return includeDrafts || !post.data.draft;
}

/** Posts visíveis, do mais novo para o mais antigo. */
export async function getPublishedPosts(opts: { includeDrafts?: boolean } = {}): Promise<Post[]> {
  const includeDrafts = opts.includeDrafts ?? import.meta.env.DEV;
  const posts = await getCollection('posts', (p) => isPublished(p, includeDrafts));
  return posts.sort((a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime());
}
