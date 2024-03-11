import { defineConfig } from 'astro/config';
// Import /static for a static site
import vercelStatic from '@astrojs/vercel/static';
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  output: 'static',
  adapter: vercelStatic(),
  i18n: {
    defaultLocale: "en",
    locales: ["en", "de"],
    routing: {
      prefixDefaultLocale: false
    }
  },
  integrations: [tailwind()]
});