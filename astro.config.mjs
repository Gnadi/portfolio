import { defineConfig } from 'astro/config';
// Import /serverless for a Serverless SSR site
import vercel from '@astrojs/vercel/serverless';
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
    maxDuration: 8,
  }),
  i18n: {
    defaultLocale: "en",
    locales: ["en", "de"],
    routing: {
      prefixDefaultLocale: false
    }
  },
  integrations: [tailwind()]
});