import { defineConfig } from 'vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import viteTsConfigPaths from 'vite-tsconfig-paths';
import tailwindcss from '@tailwindcss/vite';
import { nitroV2Plugin } from '@tanstack/nitro-v2-vite-plugin';

const config = defineConfig({
  server: {
    port: 3000,
  },
  optimizeDeps: {
    exclude: ['@tanstack/start-server-core'],
  },
  plugins: [
    // this is the plugin that enables path aliases
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tailwindcss(),
    tanstackStart(),
    nitroV2Plugin({
      preset: 'node-server',
      compatibilityDate: '2025-10-24',
    }),
    viteReact(),
  ],
});

export default config;
