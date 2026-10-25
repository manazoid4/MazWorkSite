// SEO audit of the static export in out/. Run after `npm run build`: node scripts/seo-audit.mjs
// Exits 1 on errors (missing/duplicate metadata, bad canonical, broken internal links, bad JSON-LD, sitemap drift).
import { readdir, readFile, access } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const OUT = path.join(process.cwd(), 'out');
const SITE = 'https://www.mazworks.uk';
const exists = (p) => access(p).then(() => true, () => false);

async function walk(dir) {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(full));
    else files.push(full);
  }
  return files;
}

const decode = (s) => s.replace(/&amp;/g, '&').replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const route = (file) => '/' + path.relative(OUT, file).split(path.sep).join('/').replace(/(^|\/)index\.html$/, '').replace(/\.html$/, '');

export async function audit() {
  const errors = [];
  const warnings = [];
  const files = (await walk(OUT)).filter((f) => f.endsWith('.html'));
  const pages = new Map();
  for (const file of files) {
    const r = route(file);
    if (r === '/_not-found' || r === '/404') continue;
    const html = (await readFile(file, 'utf8')).replaceAll('<!-- -->', '');
    pages.set(r, html);
  }

  const titles = new Map();
  const descriptions = new Map();
  const targets = new Set();
  for (const [r, html] of pages) {
    const title = decode(/<title>([\s\S]*?)<\/title>/.exec(html)?.[1] ?? '');
    const desc = decode(/<meta name="description" content="([^"]*)"/.exec(html)?.[1] ?? '');
    const canonical = /<link rel="canonical" href="([^"]*)"/.exec(html)?.[1];
    const robots = /<meta name="robots" content="([^"]*)"/.exec(html)?.[1] ?? '';
    const h1s = (html.match(/<h1[\s>]/g) || []).length;
    const expected = SITE + (r === '/' ? '' : r);
    const here = `${r}:`;
    if (!title) errors.push(`${here} missing <title>`);
    else if (title.length > 70) warnings.push(`${here} title is ${title.length} chars (may truncate in Google)`);
    if (!desc) errors.push(`${here} missing meta description`);
    else if (desc.length > 170) warnings.push(`${here} description is ${desc.length} chars`);
    const noindex = /noindex/i.test(robots);
    if (!canonical) { if (!noindex) errors.push(`${here} missing canonical`); }
    else if (canonical !== expected && canonical !== expected + '/') errors.push(`${here} canonical ${canonical} should be ${expected}`);
    if (/noindex/i.test(robots)) warnings.push(`${here} is noindex`);
    if (h1s !== 1) errors.push(`${here} has ${h1s} <h1> elements`);
    titles.set(title, [...(titles.get(title) || []), r]);
    descriptions.set(desc, [...(descriptions.get(desc) || []), r]);

    for (const [, json] of html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
      try { JSON.parse(json); } catch { errors.push(`${here} invalid JSON-LD`); }
    }
    for (const [, tag] of html.matchAll(/<img\b([^>]*)>/g)) if (!/\balt=/.test(tag)) errors.push(`${here} <img> without alt`);

    for (const [, href] of html.matchAll(/<a\b[^>]*\shref="([^"]+)"/g)) {
      if (!href.startsWith('/') || href.startsWith('//')) continue;
      targets.add(`${r}\t${decode(href)}`);
    }
  }
  for (const [title, rs] of titles) if (title && rs.length > 1) errors.push(`duplicate title "${title}": ${rs.join(', ')}`);
  for (const [desc, rs] of descriptions) if (desc && rs.length > 1) errors.push(`duplicate description (${desc.slice(0, 50)}…): ${rs.join(', ')}`);

  // Internal links: must hit an exported page or file, or a redirect declared in vercel.json.
  const redirects = JSON.parse(await readFile(path.join(process.cwd(), 'vercel.json'), 'utf8')).redirects.map((x) => x.source);
  const seen = new Set();
  for (const entry of targets) {
    const [from, href] = entry.split('\t');
    const clean = href.split(/[?#]/)[0];
    if (!clean || clean === '/') continue;
    const key = clean + '|' + from;
    if (seen.has(key)) continue;
    seen.add(key);
    const rel = clean.replace(/^\//, '').replace(/\/$/, '');
    const ok = pages.has('/' + rel) || await exists(path.join(OUT, rel)) || await exists(path.join(OUT, rel + '.html')) || redirects.includes('/' + rel) || clean.startsWith('/demos/');
    if (!ok) errors.push(`${from}: broken internal link ${href}`);
  }

  // Sitemap and robots.
  const sitemap = await readFile(path.join(OUT, 'sitemap.xml'), 'utf8');
  const listed = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  for (const url of listed) {
    const p = url.replace(SITE, '') || '/';
    if (!pages.has(p)) errors.push(`sitemap lists ${url} but no exported page exists`);
  }
  for (const [r, html] of pages) {
    if (/noindex/i.test(/<meta name="robots" content="([^"]*)"/.exec(html)?.[1] ?? '')) continue;
    if (r === '/3d-printing') continue; // kept out of the sitemap on purpose (tests/objects.test.mjs)
    if (!listed.includes(SITE + (r === '/' ? '' : r)) && !listed.includes(SITE + r + '/')) warnings.push(`${r}: indexable page missing from sitemap.xml`);
  }
  const robots = await readFile(path.join(OUT, 'robots.txt'), 'utf8');
  if (!/Sitemap: https:\/\/www\.mazworks\.uk\/sitemap\.xml/.test(robots)) errors.push('robots.txt does not point at the sitemap');
  if (/Disallow:\s*\/\s*$/m.test(robots)) errors.push('robots.txt blocks the whole site');

  return { pages: pages.size, errors, warnings };
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { pages, errors, warnings } = await audit();
  console.log(`Audited ${pages} pages: ${errors.length} errors, ${warnings.length} warnings`);
  for (const w of warnings) console.log('  warn ', w);
  for (const e of errors) console.log('  ERROR', e);
  process.exit(errors.length ? 1 : 0);
}
