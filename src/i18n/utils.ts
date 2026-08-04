import { defaultLang } from './ui';

export function getLangFromUrl(url: URL) {
    // Match the `/de` prefix, not the substring "de" anywhere in the path —
    // otherwise English slugs like `/work/dev-tools` would render as German.
    // Must stay in sync with the check in layouts/BaseLayout.astro.
    const { pathname } = url;
    return pathname === '/de' || pathname.startsWith('/de/') ? 'de' : defaultLang;
}