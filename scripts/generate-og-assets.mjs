/**
 * Generates the static social/PWA images that live in `public/assets`:
 *
 *   - assets/og-card.png   1200×630 Open Graph / Twitter card
 *   - assets/icons/icon-192.png, icon-512.png  PWA icons
 *
 * Sources live outside `public/` (src/assets/) so they are not deployed at
 * full size; the site itself loads the logo through astro:assets.
 *
 * The PWA icons come from src/assets/icon.png — the same tent mark as
 * favicon.ico, so the browser tab and the home-screen icon match. The Linz
 * artwork in logo.jpg is the footer illustration, not the site icon.
 *
 * Run with `node scripts/generate-og-assets.mjs` after changing the source
 * images or the card copy. The output is committed, so this is not part of the
 * build.
 */
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const assets = path.join(root, 'public', 'assets');
const icons = path.join(assets, 'icons');
const iconSource = path.join(root, 'src', 'assets', 'icon.png');

const WIDTH = 1200;
const HEIGHT = 630;
const PORTRAIT_W = 380;
const PORTRAIT_H = 470;
const PORTRAIT_X = WIDTH - PORTRAIT_W - 70;
const PORTRAIT_Y = (HEIGHT - PORTRAIT_H) / 2;

/** Escapes text for safe inclusion in the SVG source. */
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const background = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#090b11"/>
      <stop offset="60%" stop-color="#1c0056"/>
      <stop offset="100%" stop-color="#7611a6"/>
    </linearGradient>
    <linearGradient id="rule" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#c561f6"/>
      <stop offset="100%" stop-color="#7611a6"/>
    </linearGradient>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>
  <g font-family="Liberation Sans, DejaVu Sans, sans-serif">
    <text x="70" y="250" fill="#ffffff" font-size="96" font-weight="bold"
          letter-spacing="-2">${esc('Gnadlinger')}</text>
    <rect x="72" y="285" width="120" height="6" rx="3" fill="url(#rule)"/>
    <text x="70" y="360" fill="#e2e4e9" font-size="40" font-weight="bold">
      ${esc('Johannes Gnadlinger')}
    </text>
    <text x="70" y="412" fill="#a3a8b8" font-size="30">
      ${esc('Backend Engineer · Linz, Austria')}
    </text>
    <text x="70" y="460" fill="#a3a8b8" font-size="30">
      ${esc('Corporate payment systems')}
    </text>
    <text x="70" y="556" fill="#c561f6" font-size="26" font-weight="bold"
          letter-spacing="1">${esc('gnadlinger.me')}</text>
  </g>
</svg>
`);

const portraitMask = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${PORTRAIT_W}" height="${PORTRAIT_H}">
  <rect width="${PORTRAIT_W}" height="${PORTRAIT_H}" rx="32" ry="32" fill="#fff"/>
</svg>
`);

async function buildOgCard() {
	const portrait = await sharp(path.join(assets, 'portrait.webp'))
		.resize(PORTRAIT_W, PORTRAIT_H, { fit: 'cover', position: 'top' })
		.composite([{ input: portraitMask, blend: 'dest-in' }])
		.png()
		.toBuffer();

	await sharp(background)
		.composite([{ input: portrait, left: PORTRAIT_X, top: Math.round(PORTRAIT_Y) }])
		.png({ compressionLevel: 9 })
		.toFile(path.join(assets, 'og-card.png'));
}

async function buildIcons() {
	await mkdir(icons, { recursive: true });
	for (const size of [192, 512]) {
		// The source is a 48x48 icon, so it is upscaled; lanczos3 keeps the flat
		// shapes clean and `contain` preserves the transparent background.
		await sharp(iconSource)
			.resize(size, size, {
				kernel: 'lanczos3',
				fit: 'contain',
				background: { r: 0, g: 0, b: 0, alpha: 0 },
			})
			.png({ compressionLevel: 9 })
			.toFile(path.join(icons, `icon-${size}.png`));
	}
}

await buildOgCard();
await buildIcons();
console.log('Generated og-card.png and icons/');
