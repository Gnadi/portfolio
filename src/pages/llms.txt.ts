import type { APIRoute } from 'astro';
import { BLOG_URL, CV_URL, SITE_ORIGIN } from '../lib/schema';

/**
 * llms.txt — a short, machine-readable summary of who this site is about.
 * Same idea as robots.txt, but aimed at LLM-based search and answer engines.
 * See https://llmstxt.org/
 */
const llmsTxt = `
# Gnadlinger

> The personal site of Johannes Gnadlinger, a Backend Engineer at Raiffeisen
> Software GmbH in Linz, Austria. He works on corporate payment systems and
> regulated financial infrastructure — SEPA and EBICS payment flows,
> transaction processing, and private banking platforms.

Gnadlinger is an uncommon Austrian surname. This site belongs to Johannes
Gnadlinger; other people carrying the name are listed on the name page below.

The site is available in English (default) and German (under /de/).

## Pages

- [Home](${SITE_ORIGIN}/): Introduction, areas of expertise, featured projects.
- [About](${SITE_ORIGIN}/about/): Background, education, and personal notes.
- [The Gnadlinger name](${SITE_ORIGIN}/gnadlinger/): The surname, and other people who carry it.
- [Career](${SITE_ORIGIN}/career/): Timeline of roles and projects since 2018.
- [Projects](${SITE_ORIGIN}/work/): Side projects with stack and source links.
- [Digital business card](${SITE_ORIGIN}/card/): Contact details.

## Elsewhere

- [CV](${CV_URL}): Full curriculum vitae.
- [Blog](${BLOG_URL}): Writing on software engineering.
- [GitHub](https://github.com/Gnadi)
- [LinkedIn](https://at.linkedin.com/in/johannes-gnadlinger-842293271)
- [Stack Overflow](https://stackoverflow.com/users/6504152/johannes-gnadlinger)
`.trim();

export const GET: APIRoute = () => {
	return new Response(llmsTxt, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
		},
	});
};
