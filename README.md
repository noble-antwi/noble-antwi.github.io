# noble-antwi.github.io

Personal site of Noble Antwi, Cloud Security & Identity Engineer. Live at [noble-antwi.github.io](https://noble-antwi.github.io/).

Built with [Astro](https://astro.build) and deployed to GitHub Pages by the workflow in `.github/workflows/deploy.yml` on every push to `main`.

## Working on it

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static output in dist/
```

## Where things live

| What | Where |
|------|-------|
| Journal posts (markdown, Jekyll-era URLs preserved) | `src/content/posts/` |
| Project case studies, with evidence images | `src/content/work/` and `src/assets/work/<slug>/` |
| Certifications, courses, published articles | `src/data/` |
| Pages | `src/pages/` |
| Design system | `src/styles/global.css` |
| Old URL redirects | `astro.config.mjs` |

Post URLs follow `/<category>/<yyyy>/<mm>/<dd>/<slug>.html`, derived from the file name and front matter, so links indexed before the rebuild keep working.
