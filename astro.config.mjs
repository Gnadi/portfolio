import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";

import sitemap from "@astrojs/sitemap";

/** Rough importance ranking for the sitemap. The homepages are the entity
 *  home, the about pages are what a "Gnadlinger" search should land on,
 *  everything else follows. */
function priorityFor(pathname) {
  if (pathname === '/' || pathname === '/de/') return 1.0;
  if (/^\/(de\/)?about\/?$/.test(pathname)) return 0.9;
  if (/^\/(de\/)?(work|career)\/?$/.test(pathname)) return 0.8;
  if (/^\/(de\/)?work\/.+/.test(pathname)) return 0.7;
  return 0.5;
}

// https://astro.build/config
export default defineConfig({
  i18n: {
    defaultLocale: "en",
    locales: ["en", "de"],
    routing: {
      prefixDefaultLocale: false
    }
  },
  site: 'https://www.gnadlinger.me/',
  integrations: [tailwind(), sitemap({
    i18n: {
      defaultLocale: 'en',
      locales: {
        en: 'en',
        de: 'de'
      },
    },
    // The 404s are marked noindex — keep them out of the sitemap too.
    filter: (page) => !/\/404\/?$/.test(new URL(page).pathname),
    serialize(item) {
      const { pathname } = new URL(item.url);
      return {
        ...item,
        changefreq: 'monthly',
        priority: priorityFor(pathname),
      };
    },
  })]
});
