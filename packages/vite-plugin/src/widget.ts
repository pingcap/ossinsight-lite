import path from 'node:path';
import { glob } from 'glob';
import { ViteDevServer } from 'vite';
import { makeWidgetsManifestMiddleware } from './manifest.js';

export type Widget = {
  source: string
  module?: any
}

export type Widgets = {
  [name: string]: Widget
}

export function addWidget (widgets: Widgets, fn: string) {
  widgets[getWidgetId(fn)] = {
    source: getSource(fn),
  };
}

export function removeWidget (widgets: Widgets, fn: string) {
  delete widgets[getWidgetId(fn)];
}

export function watchWidgets (server: ViteDevServer, widgets: Widgets, includeFilter: (id) => boolean) {
  server.watcher.on('add', fn => {
    if (includeFilter(fn)) {
      addWidget(widgets, fn);
    }
  });

  server.watcher.on('unlink', fn => {
    removeWidget(widgets, fn);
  });

  server.middlewares.use(makeWidgetsManifestMiddleware(widgets));
}

export async function loadWidgets (widgets: Widgets, SOURCES: string, excludeFilter: (id: string) => boolean) {
  console.log('load widgets');
  const files = (await glob(SOURCES))
    .filter(excludeFilter);

  files.forEach(fn => {
    addWidget(widgets, path.resolve(process.cwd(), fn));
  });
}

function getWidgetId (fn: string) {
  return path.relative(path.join(process.cwd(), 'widgets'), path.dirname(fn));
}

function getSource (fn: string) {
  return path.relative(process.cwd(), fn);
}