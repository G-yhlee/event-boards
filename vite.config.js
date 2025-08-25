import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte()],
  build: {
    outDir: 'public'
  },
  resolve: {
    alias: {
      '$lib': '/src/lib',
      '$domain': '/src/lib/domain',
      '$ui': '/src/ui',
      '$infrastructure': '/src/lib/infrastructure'
    }
  }
});