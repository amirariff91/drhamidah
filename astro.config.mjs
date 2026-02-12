import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import preact from '@astrojs/preact';

export default defineConfig({
  site: 'https://drhamidah.cepathosting.com',
  integrations: [tailwind(), sitemap(), preact()],
  compressHTML: true,
});
