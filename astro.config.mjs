import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import preact from '@astrojs/preact';

export default defineConfig({
  site: 'https://drhamidah.com',
  integrations: [tailwind(), sitemap(), preact()],
  compressHTML: true,
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
});
