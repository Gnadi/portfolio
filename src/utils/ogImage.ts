import { getImage } from 'astro:assets';
import type { CollectionEntry } from 'astro:content';

/** Social cards are rendered at 1.91:1 — anything else gets cropped by the platform. */
const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

/**
 * Absolute URL of the social-card image for a project.
 *
 * Prefers an explicit `ogImage`, then the first landscape screenshot. Phone
 * screenshots are a poor fit for a wide card, so a project made up entirely of
 * them should set `ogImage` rather than fall through to the last resort here.
 */
export async function projectOgImage(
	entry: CollectionEntry<'work'>,
	site: URL | undefined
): Promise<string | undefined> {
	const shots = entry.data.screenshots;
	const source =
		entry.data.ogImage ??
		shots.find((shot) => shot.orientation === 'landscape')?.src ??
		shots[0]?.src;

	if (!source) return undefined;

	const image = await getImage({
		src: source,
		width: OG_WIDTH,
		height: OG_HEIGHT,
		fit: 'cover',
		// App screenshots carry their meaning at the top — a centre crop tends to
		// land on empty content area.
		position: 'top',
		format: 'jpeg',
		quality: 82,
	});

	return new URL(image.src, site).href;
}
