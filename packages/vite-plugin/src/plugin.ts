import type { Plugin, ResolvedConfig } from 'vite';
import { createFilter, FilterPattern } from 'vite';
import collectManifest from './manifest.js';
import { loadWidgets, watchWidgets, Widgets } from './widget.js';
import path from 'node:path';
import fsp from 'fs/promises';

export interface PluginOptions {
  exclude?: FilterPattern;
  page?: boolean;
}

export default function widgets ({
  exclude,
  page = false,
}: PluginOptions = {}): Plugin {
  const SOURCES = 'widgets/**/index.ts';
  const includeFilter = createFilter(SOURCES);
  const excludeFilter = createFilter(exclude);

  const widgets: Widgets = {};

  let outDir: string;
  let command: ResolvedConfig['command'];

  return {
    name: 'widgets',
    async config (config, env) {
      if (env.command === 'build') {
        await loadWidgets(widgets, SOURCES, excludeFilter);

        if (page) {
          return {
            build: {
              outDir: 'page-dist',
            }
          };
        }

        const entry: Record<string, string> = {};
        for (let [name, widget] of Object.entries(widgets)) {
          entry[path.join(name, 'index')] = widget.source;
        }

        entry['index'] = 'widgets/index.css';

        return {
          build: {
            lib: {
              entry: entry,
              formats: ['es'],
            },
          },
        };
      }
    },
    async configResolved (config) {
      outDir = config.build.outDir;
      command = config.command;
    },
    async configureServer (server) {
      await loadWidgets(widgets, SOURCES, excludeFilter);
      watchWidgets(server, widgets, includeFilter);
    },
    resolveId (id, source, importer) {
      if (id === 'app:widgets-manifest') {
        return 'app:widgets-manifest?internal';
      }
    },
    async load (id) {
      if (id === 'app:widgets-manifest?internal') {
        function normalize (name: string) {
          return name
            .replace(/\//g, '__')
            .replace(/-/g, '_');
        }

        const head = Object
          .entries(widgets)
          .map(([key, widget]) => `const ${normalize(key)} = () => import('/${widget.source}');`)
          .join('\n');

        const newWidgets = { ...widgets };
        Object.entries(newWidgets).forEach(([name, widget]) => {
          widget.module = `@@${normalize(name)}@@`;
        });

        const exportStmt = `export default ${JSON.stringify(newWidgets, undefined, 2)}`
          .replace(/"@@|@@"/g, '');

        return `${head}\n${exportStmt}`;
      }
    },
    async closeBundle () {
      await fsp.writeFile(
        path.join(outDir, 'widgets-manifest.json'),
        JSON.stringify(collectManifest(widgets), undefined, 2),
      );
    },
  };
}

