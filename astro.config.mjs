import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  i18n: {
    defaultLocale: "en",
    locales: ["en", "de"],
    routing: {
      prefixDefaultLocale: false
    }
  },
  site: 'https://www.johannes.gnadlinger.me/',
  integrations: [tailwind(), sitemap({
    i18n: {
      defaultLocale: 'en', // All urls that don't contain `es` or `fr` after `https://stargazers.club/` will be treated as default locale, i.e. `en`
      locales: {
        en: 'en', // The `defaultLocale` value must present in `locales` keys
        de: 'de'
      },
    },
  })]
});