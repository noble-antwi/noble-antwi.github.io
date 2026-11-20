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
    /** Renders a full-width case file component instead of the prose body. */
    casefile: z.string().optional(),
    /** Places an interactive replay between the tldr and the prose (key in REPLAYS, [...slug].astro). */
    replay: z.string().optional(),
    /** A short name for links that have little room. */
    short: z.string().optional(),
  }),
});

const work = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      kicker: z.string(),
      summary: z.string(),
      /** One short sentence for places with little room, such as the homepage case files. */
      teaser: z.string().optional(),
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
      /** A picture for the project's card on the Work page, when the case study has no hero image. */
      cardImage: image().optional(),
      heroAlt: z.string().optional(),
      heroCaption: z.string().optional(),
      stats: z.array(z.object({ value: z.string(), label: z.string() })).default([]),
      gallery: z
        .array(z.object({ src: image(), alt: z.string(), caption: z.string().optional(), group: z.string().optional() }))
        .default([]),
    }),
});

/* One long-form write-up per homelab implementation; the file name is the slug in src/data/homelab-builds.ts.
   Body only: the page supplies the title, the lead and the links. Screenshots sit inline, as numbered figures. */
const homelab = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/homelab' }),
  schema: z.object({}),
});

/* One Azure lab per file: the lab's own README, brought in by scripts/sync-azure-labs.mjs. Do not edit these by hand;
   change the README in the labs repository and run the script again. */
const azurelabs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/azurelabs' }),
  schema: z.object({
    title: z.string(),
    n: z.number(),
    folder: z.string(),
    motion: z.string(),
    motionAlt: z.string(),
    motionCaption: z.string(),
    figure: z.string(),
    hasVertical: z.boolean().default(false),
  }),
});

export const collections = { posts, work, homelab, azurelabs };
