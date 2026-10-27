import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { site } from '../config/site';
import { getPublishedPosts } from '../lib/posts';

export async function GET(context: APIContext) {
  // Rascunhos nunca entram no RSS, nem em desenvolvimento.
  const posts = await getPublishedPosts({ includeDrafts: false });

  return rss({
    title: `${site.name} — Blog`,
    description: site.description,
    site: context.site ?? site.url,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.publishedAt,
      link: `/blog/${post.id}/`,
      categories: post.data.tags,
    })),
    customData: `<language>${site.lang}</language>`,
  });
}
