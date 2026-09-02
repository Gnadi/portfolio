/**
 * schema.org JSON-LD for the site.
 *
 * Everything is emitted as a single `@graph` with stable `@id` anchors, so the
 * nodes can reference each other instead of repeating themselves. The `@id`
 * values are absolute and intentionally host-independent: `cv.gnadlinger.me`
 * and `blog.gnadlinger.me` reference the *same* `PERSON_ID`, which is how
 * search engines merge the three hosts into one entity.
 */

/** Canonical origin of the main site. Keep in sync with `site` in astro.config.mjs. */
export const SITE_ORIGIN = 'https://www.gnadlinger.me';

/** Stable entity anchors — referenced from the CV and blog subdomains too. */
export const PERSON_ID = `${SITE_ORIGIN}/#person`;
export const WEBSITE_ID = `${SITE_ORIGIN}/#website`;
export const EMPLOYER_ID = `${SITE_ORIGIN}/#raiffeisen-software`;

export const CV_URL = 'https://cv.gnadlinger.me/';
export const BLOG_URL = 'https://blog.gnadlinger.me/';

/** The site brand. Deliberately the surname alone — see also `og:site_name`. */
export const BRAND = 'Gnadlinger';
export const FULL_NAME = 'Johannes Gnadlinger';

/** Fallback `<title>` and description for pages that set neither. Shared so
 *  the head and the AI prompt below the fold describe the same page. */
export const DEFAULT_TITLE = `${BRAND} — ${FULL_NAME}, Backend Engineer`;
export const DEFAULT_DESCRIPTION =
	'Johannes Gnadlinger — Backend Engineer for corporate payment systems and financial infrastructure, based in Linz, Austria.';

export type JsonLdNode = Record<string, unknown>;

/** Absolute URL for a page path — matches the `<link rel="canonical">` value. */
export function canonicalUrl(pathname: string): string {
	return new URL(pathname, `${SITE_ORIGIN}/`).href;
}

/** Profiles that describe the same person. Kept in one place so the markup and
 *  the visible links can never drift apart. */
export const SAME_AS = [
	'https://github.com/Gnadi',
	'https://www.linkedin.com/in/johannes-gnadlinger-842293271',
	'https://stackoverflow.com/users/6504152/johannes-gnadlinger',
	CV_URL,
	BLOG_URL,
];

/** The employer, as its own node so `worksFor` and the career entries share it. */
export function employerNode(): JsonLdNode {
	return {
		'@type': 'Organization',
		'@id': EMPLOYER_ID,
		name: 'Raiffeisen Software GmbH',
		url: 'https://r-software.at',
		address: {
			'@type': 'PostalAddress',
			addressLocality: 'Linz',
			addressRegion: 'Oberösterreich',
			addressCountry: 'AT',
		},
	};
}

/**
 * The central Person node. This is the entity the whole site exists to
 * establish; every other node hangs off it.
 */
export function personNode(): JsonLdNode {
	return {
		'@type': 'Person',
		'@id': PERSON_ID,
		name: FULL_NAME,
		givenName: 'Johannes',
		familyName: 'Gnadlinger',
		url: `${SITE_ORIGIN}/`,
		image: `${SITE_ORIGIN}/assets/portrait.webp`,
		jobTitle: 'Backend Engineer',
		description:
			'Backend Engineer specialising in corporate payment systems and financial infrastructure, based in Linz, Austria.',
		worksFor: { '@id': EMPLOYER_ID },
		hasOccupation: {
			'@type': 'Occupation',
			name: 'Backend Engineer',
			occupationLocation: {
				'@type': 'City',
				name: 'Linz',
			},
		},
		address: {
			'@type': 'PostalAddress',
			addressLocality: 'Linz',
			addressRegion: 'Oberösterreich',
			addressCountry: 'AT',
		},
		homeLocation: {
			'@type': 'Place',
			name: 'Linz, Österreich',
		},
		nationality: {
			'@type': 'Country',
			name: 'Österreich',
		},
		knowsLanguage: ['de', 'en'],
		knowsAbout: [
			'Corporate payment systems',
			'SEPA',
			'EBICS',
			'Payment transaction processing',
			'Private banking systems',
			'Backend engineering',
			'Java',
			'Quarkus',
			'Angular',
			'TypeScript',
		],
		mainEntityOfPage: { '@id': `${SITE_ORIGIN}/about/` },
		subjectOf: [{ '@id': `${BLOG_URL}#website` }],
		sameAs: SAME_AS,
	};
}

/** The site itself — this is the node that teaches search engines the brand. */
export function websiteNode(lang: 'en' | 'de'): JsonLdNode {
	return {
		'@type': 'WebSite',
		'@id': WEBSITE_ID,
		url: `${SITE_ORIGIN}/`,
		name: BRAND,
		alternateName: [FULL_NAME, 'gnadlinger.me'],
		description:
			lang === 'de'
				? 'Persönliche Website von Johannes Gnadlinger, Backend Engineer in Linz.'
				: 'Personal website of Johannes Gnadlinger, Backend Engineer in Linz, Austria.',
		inLanguage: lang === 'de' ? 'de-AT' : 'en',
		publisher: { '@id': PERSON_ID },
		copyrightHolder: { '@id': PERSON_ID },
	};
}

/**
 * `ProfilePage` is the type Google documents specifically for pages that are
 * *about* a person — use it on the about pages, not everywhere.
 */
export function profilePageNode(canonical: string): JsonLdNode {
	return {
		'@type': 'ProfilePage',
		'@id': `${canonical}#profilepage`,
		url: canonical,
		mainEntity: { '@id': PERSON_ID },
		about: { '@id': PERSON_ID },
		isPartOf: { '@id': WEBSITE_ID },
	};
}

export interface Crumb {
	name: string;
	/** Absolute URL. Omitted on the final crumb, which is the current page. */
	item?: string;
}

export function breadcrumbNode(canonical: string, crumbs: Crumb[]): JsonLdNode {
	return {
		'@type': 'BreadcrumbList',
		'@id': `${canonical}#breadcrumb`,
		itemListElement: crumbs.map((crumb, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			name: crumb.name,
			...(crumb.item ? { item: crumb.item } : {}),
		})),
	};
}

export interface ProjectSchemaInput {
	canonical: string;
	name: string;
	description: string;
	datePublished: Date;
	/** The project's own live URL, if it has one. */
	url?: string | undefined;
	repo?: string | undefined;
	stack?: readonly string[] | undefined;
	image?: string | undefined;
	lang: 'en' | 'de';
}

/**
 * Side projects are software, so `SoftwareApplication` fits better than a bare
 * `CreativeWork` — and it carries `author` back to the Person.
 */
export function projectNode(input: ProjectSchemaInput): JsonLdNode {
	return {
		'@type': 'SoftwareApplication',
		'@id': `${input.canonical}#project`,
		name: input.name,
		description: input.description,
		url: input.url ?? input.canonical,
		applicationCategory: 'WebApplication',
		datePublished: input.datePublished.toISOString().slice(0, 10),
		inLanguage: input.lang === 'de' ? 'de-AT' : 'en',
		author: { '@id': PERSON_ID },
		creator: { '@id': PERSON_ID },
		isPartOf: { '@id': WEBSITE_ID },
		...(input.repo ? { codeRepository: input.repo } : {}),
		...(input.stack?.length ? { softwareRequirements: input.stack.join(', ') } : {}),
		...(input.image ? { image: input.image } : {}),
	};
}

/**
 * Wraps the per-page nodes together with the two nodes every page carries.
 * Returns the serialised graph, ready for `set:html`.
 */
export function buildGraph(lang: 'en' | 'de', extra: JsonLdNode[] = []): string {
	return JSON.stringify({
		'@context': 'https://schema.org',
		'@graph': [websiteNode(lang), personNode(), employerNode(), ...extra],
	});
}
