import { defaultLang, type SiteLang } from './ui';

/**
 * True for pages served under `/de`.
 *
 * Matching the path segment matters: a substring test would also match an
 * English slug that merely contains "de" (`/work/design-system/`) and flip the
 * page to German.
 */
export function isGermanPath(pathname: string): boolean {
	return pathname === '/de' || pathname.startsWith('/de/');
}

export function getLangFromUrl(url: URL): SiteLang {
	return isGermanPath(url.pathname) ? 'de' : defaultLang;
}
