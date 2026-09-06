import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    category: z.string().default('learning'),
    tags: z.array(z.string()).default([]),
    description: z.string().optional(),
    read_time: z.number().optional(),
  }),
});

const work = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      kicker: z.string(),
      summary: z.string(),
      category: z.enum(['identity', 'cloud', 'detection', 'assessment']),
      status: z.enum(['active', 'complete', 'academic']),
      statusLabel: z.string(),
      order: z.number(),
      featured: z.boolean().default(false),
      period: z.string().optional(),
      role: z.string().optional(),
      repo: z.string().url().optional(),
      docs: z.string().url().optional(),
      docsLabel: z.string().optional(),
      stack: z.array(z.string()).default([]),
      relatedTags: z.array(z.string()).default([]),
      hero: image().optional(),
      heroAlt: z.string().optional(),
      heroCaption: z.string().optional(),
      stats: z.array(z.object({ value: z.string(), label: z.string() })).default([]),
      gallery: z
        .array(z.object({ src: image(), alt: z.string(), caption: z.string().optional() }))
        .default([]),
    }),
});

export const collections = { posts, work };
