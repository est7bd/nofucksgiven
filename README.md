# nofucksgiven.org

Static Cloudflare Pages site for the "Zero Noise Hub" concept.

## Deploy
Upload the contents of this folder to Cloudflare Pages as a static site.

## Structure
- `index.html` — homepage
- `links.html` — curated hub of links
- `about.html` — positioning / curation rules
- `404.html` — custom not found page
- `assets/css/site.css` — global styles
- `assets/js/site.js` — partial loading, raw mode toggle, easter egg
- `assets/partials/header.html` — sticky header
- `assets/partials/footer.html` — footer
- `_headers` — Cloudflare headers and cache rules
- `_redirects` — minimal redirects only
- `robots.txt`, `sitemap.xml`, `site.webmanifest`

## Notes
- Internal links use clean URLs only.
- Partials use relative fetch paths.
- "No Fucks Given Mode" toggle on `/links` swaps default descriptions for blunt copy.
- Easter egg: type `care`.

## Things you may want to change
- Page copy
- Link set on `links.html`
- Social image at `assets/img/og-image.png`
- Redirect aliases in `_redirects`
