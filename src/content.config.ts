import { defineCollection } from 'astro:content';
import { z } from 'zod';
import { glob } from 'astro/loaders';

export const collections = {
	work: defineCollection({
		loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
		// `image()` resolves paths relative to the entry file and hands the
		// build the real asset, so Astro can emit width/height and a srcset.
		schema: ({ image }) => z.object({
			title: z.string(),
			description: z.string(),
			publishDate: z.coerce.date(),
			tags: z.array(z.string()),
			img: z.string().optional(),
			img_alt: z.string().optional(),
			url: z.string().url(),
			status: z.enum(['live', 'preview']).optional(),
			/** Public source repository, shown as a secondary link on the detail page. */
			repo: z.string().url().optional(),
			/** One-liner under the title on the detail page. */
			tagline: z.string().optional(),
			/** Libraries and services the project is built on. */
			stack: z.array(z.string()).default([]),
			/** Screenshots rendered as a gallery above the write-up. */
			screenshots: z
				.array(
					z.object({
						src: image(),
						alt: z.string(),
						caption: z.string().optional(),
						/** Phone-shaped shots get a narrower column in the gallery. */
						orientation: z.enum(['landscape', 'portrait']).default('landscape'),
					})
				)
				.default([]),
			/**
			 * Social-card image. Falls back to the first landscape screenshot, so
			 * this is only needed where every shot is phone-shaped.
			 */
			ogImage: image().optional(),
		})
	}),
	contact: defineCollection({
		loader: glob({ pattern: '**/*.md', base: './src/content/contact' }),
		schema: z.object({
			title: z.string(),
			description: z.string(),
			publishDate: z.coerce.date(),
			tags: z.array(z.string()),
			img: z.string(),
			img_alt: z.string().optional(),
		})
	})
};
