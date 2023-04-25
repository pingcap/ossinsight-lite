import { defineConfig } from 'vite';
import widgets, { mysqlPlugin } from 'widgets-vite-plugin';
import viteReact from '@vitejs/plugin-react';
import ssr from 'vite-plugin-ssr/plugin'
import svgr from 'vite-plugin-svgr';

export default defineConfig((env) => ({
  plugins: [
    viteReact(),
    svgr({
      svgrOptions: {
        svgProps: {
          fill: 'currentColor'
        }
      }
    }),
    ssr({
      prerender: true,
      baseAssets: 'https://widgets-4qua8djg9-djagger.vercel.app',
    }),
    widgets({ page: true }),
    mysqlPlugin(),
  ],
  build: {
    outDir: 'page-dist',
  }
}));
