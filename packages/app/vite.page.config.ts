import { defineConfig } from 'vite';
import widgets, { mysqlPlugin } from 'widgets-vite-plugin';
import viteReact from '@vitejs/plugin-react';

export default defineConfig((env) => ({
  plugins: [
    widgets({ page: true }),
    mysqlPlugin(),
    viteReact(),
  ]
}));
