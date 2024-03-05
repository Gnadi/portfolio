import { defaultLang } from './ui';

export function getLangFromUrl(url: URL) {
    return url.pathname.includes("de") ? 'de' : defaultLang;
}