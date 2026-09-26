# Ragnarok — static Astro replica

A static rebuild of the public Framer template [ragnarok.framer.ai](https://ragnarok.framer.ai/) in
Astro 7 + Tailwind CSS 4, with the template's own images, videos and fonts served locally. It has no
framework runtime and no islands. Interactions are small TypeScript modules in `src/scripts/`.

The blog articles, job descriptions and legal pages use original placeholder text. Their page
layouts follow the reference; their full bodies are not verbatim copies. Forms and account pages
are visual demos and do not submit data or authenticate users.

## Run locally

Install [Bun](https://bun.sh) first (verified with Bun 1.4.2), then:

```sh
git clone https://github.com/polly3223/ragnarok-astro.git
cd ragnarok-astro
bun install --frozen-lockfile
bun run dev
```

Open **http://localhost:4396**. No API keys, environment variables, database or backend are required.
Images, videos and fonts are included in the repository.

To check and build the static site, then preview the production output:

```sh
bun run check
bun run build
bun run preview
```

Open **http://127.0.0.1:4396** for the production preview. Stop the development server first if
it is already using that port. To use a different port, run `bun --bun astro dev --port 4400` or
`bun --bun astro preview --port 4400`.

## Commands

Requires [Bun](https://bun.sh). Astro runs on Bun (`bun --bun`), so no system Node upgrade is needed.

| Command                         | Does                                                   |
| ------------------------------- | ------------------------------------------------------ |
| `bun install`                   | Install the pinned dependencies                        |
| `bun run dev`                   | Dev server on http://localhost:4396                    |
| `bun run check`                 | `astro check` (types, strictest tsconfig)              |
| `bun run build`                 | Static site in `dist/` (24 pages, including `404.html`) |
| `bun run preview`               | Serve `dist/` on http://127.0.0.1:4396                 |
| `bun scripts/fetch-assets.ts`   | Re-download any missing asset listed in the manifest   |

`dist/` is plain static files with directory-style URLs (`/about/index.html`), so any static host
works. Serve `404.html` for unknown paths.

## Layout

```
src/pages/         routes: home, about, pricing, contact, blog/, careers/, legal/, auth pages, 404
src/layouts/       Layout.astro: head, navbar, side margins, CTA marquee, footer, Buy Template card
src/components/    ui/ (shared pieces), layout/, home/, sections/ (pricing, FAQ), blog/, careers/,
                   pricing/, auth/
src/content/       Markdown collections: blog posts, jobs; legal.md (stand-in bodies, see above)
src/data/          plans and FAQ lists
src/scripts/       interactions: navbar, sliders, tickers, typewriters, hover effects, preloader…
src/icons/         SVG icons recreated from the template's inline SVGs
src/styles/        global.css: Tailwind theme (colours, fonts, breakpoints 810/1200), type styles
public/            local copies of the template's assets; sources in assets.manifest.json
```

## Behaviour notes

- **Forms** (contact, job applications, sign in/up, password, account) keep native validation but never
  send anything. On submit the button briefly reads "Not sent · static demo". The Google and GitHub
  buttons are inert.
- **Outbound links** that go to accurate destinations are kept from the template: Framer referral CTAs,
  the Contra "Buy Template" page, FrameAuth and the map link. The template attached its author's
  personal social profiles to fictional team members and to the brand's footer icons. Those, and the
  placeholder phone numbers and email, point at `#` here. The footer's "Made by" credits link to the
  template's real creators.
- **Motion** mirrors the original, including the home preloader, ASCII video backgrounds (canvas),
  scramble and pixel hover effects, tickers, the hero sequence, the testimonial slider and counters.

## Credits

Design reference: [Ragnarok](https://ragnarok.framer.ai/). Original creator credits are preserved
in the footer. `assets.manifest.json` records the source URL of each third-party asset.
Third-party designs, images, videos and fonts retain their original rights and licenses.
