// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://noble-antwi.github.io',
  // 'preserve' keeps `folder/index.astro` -> `folder/index.html` and the
  // dynamic post route `[...slug].astro` -> `<slug>.html`, which is how the
  // Jekyll-era post URLs were shaped. Nothing that Google has indexed breaks.
  build: { format: 'preserve' },
  trailingSlash: 'ignore',
  integrations: [sitemap()],
  markdown: {
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark-dimmed' },
      wrap: false,
    },
  },
  // Old Jekyll URLs. Static output turns these into small meta-refresh pages.
  redirects: {
    '/projects': '/work/',
    '/blog': '/writing/',
    '/certifications': '/credentials/',
    '/cloud-certifications': '/credentials/',
    '/security-certifications': '/credentials/',
    '/in-progress': '/credentials/',
    '/training-courses': '/credentials/training/',
    '/resume': '/credentials/',
    '/resume/': '/credentials/',
  },
});
