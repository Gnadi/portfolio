export const languages = {
    en: 'English',
    de: 'Deutsch',
};

export const defaultLang = 'en';

export const ui = {
    de: {
        'nav.home': 'Zuhause',
        'nav.about': 'Über mich',
    },
} as const;

/** Copy for the project detail pages, in both site languages. */
export const project = {
    en: {
        back: 'All projects',
        visit: 'Visit live site',
        source: 'Source on GitHub',
        screenshots: 'Screenshots',
        stack: 'Built with',
        close: 'Close image',
        live: 'Live',
        preview: 'Preview',
        published: 'Started',
    },
    de: {
        back: 'Alle Projekte',
        visit: 'Zur Website',
        source: 'Quellcode auf GitHub',
        screenshots: 'Screenshots',
        stack: 'Tech-Stack',
        close: 'Bild schließen',
        live: 'Live',
        preview: 'Vorschau',
        published: 'Gestartet',
    },
} as const;

export type SiteLang = keyof typeof project;