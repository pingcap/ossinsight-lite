import { defineConfig } from 'vite';
import widgets, { mysqlPlugin } from 'widgets-vite-plugin';
import viteReact from '@vitejs/plugin-react';
import externalGlobals from 'rollup-plugin-external-globals';


export default defineConfig((env) => ({
  plugins: [
    widgets(),
    mysqlPlugin(),
    viteReact({
      jsxRuntime: env.command === 'build' ? 'classic' : 'automatic',
    }),
    {
      apply: 'build',
      ...externalGlobals({
        'react': 'React',
        'react-dom': 'ReactDOM',
      }),
    },
  ],
}));
