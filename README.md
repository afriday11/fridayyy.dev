# danfessler.com

Source for [danfessler.com](https://danfessler.com)—a personal portfolio and blog built with [Astro](https://astro.build). The site combines a home page with featured work, a blog (Markdown + MDX), art and dev project galleries, and résumé views backed by JSON data.

## Stack

- **Astro 5** — static pages, layouts, content routing
- **React** — interactive pieces (carousel, navigation, résumé UI, Disqus, etc.)
- **MDX** — blog posts where components are needed
- **Sass** — `global.scss` plus CSS modules for components
- **Integrations** — `@astrojs/mdx`, `@astrojs/react`, `@astrojs/rss`, `@astrojs/sitemap`

## Project structure

```text
/
├── public/                 # static assets (favicons, images, etc.)
├── src/
│   ├── assets/             # global styles, icons
│   ├── components/         # React + SCSS modules
│   ├── layouts/            # Layout.astro, BlogLayout, PostLayout
│   ├── pages/
│   │   ├── index.astro     # home
│   │   ├── blog.astro      # blog index
│   │   ├── blog/           # *.md, *.mdx posts
│   │   ├── art/            # art write-ups + [...category].astro
│   │   ├── dev/            # dev project pages + [...category].astro
│   │   ├── resume*.astro   # résumé routes
│   │   └── rss*.xml.ts     # RSS feeds (all, blog-only, art, dev)
│   ├── resume_*.json       # résumé data (dev, art, hybrid, netflix tones)
│   └── types/
├── astro.config.mjs        # site URL, integrations
└── package.json
```

Production `site` is `https://danfessler.com`; local dev uses `http://localhost:4321` (see `astro.config.mjs`).

## Commands

| Command           | Action                                      |
| ----------------- | ------------------------------------------- |
| `npm install`     | Install dependencies                        |
| `npm run dev`     | Dev server (with `--host` for LAN access)   |
| `npm run build`   | Production build to `./dist/`               |
| `npm run preview` | Serve the production build locally          |

## Content notes

- **Blog**: add files under `src/pages/blog/` with frontmatter (`pubDate`, etc.). Use `hidden: true` to omit from listings.
- **Art / dev**: pages live under `src/pages/art/` and `src/pages/dev/`; category routes are handled by `[...category].astro`.
- **Résumé**: copy and tone variants are driven by `src/resume_*.json` and the pages under `src/pages/resume/`.
