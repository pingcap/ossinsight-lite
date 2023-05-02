import { LoaderDefinitionFunction } from 'webpack';
import { globSync } from 'glob';
import * as path from 'node:path';
import * as fs from 'node:fs';
import { cwd } from '../utils/path.js';

type Widgets = Record<string, Widget>
type Widget = {
  module?: string
  source: string
  cssSource: string | undefined
}

const widgetsManifestLoader: LoaderDefinitionFunction = function (content, map, meta) {
  const paths = globSync('src/widgets/*/**/index.ts');

  const widgets: Widgets = {};

  paths.forEach(fn => {
    this.resolve(cwd('.'), './' + getSource(fn), () => void 0);

    widgets[getWidgetId(fn)] = {
      source: getSource(fn),
      cssSource: getCssSource(fn),
    };
  });

  function normalize (name: string) {
    return name
      .replace(/\//g, '__')
      .replace(/-/g, '_');
  }

  const makeDynamicImport = (module: Widget) => {
    if (module.cssSource) {
      return `\n  import('/${module.cssSource}', { assert: { type: 'css' } })\n    .then(() => import('/${module.source}', { assert: { type: 'javascript' } }))`;
    } else {
      return `import('/${module.source}', { assert: { type: 'javascript' } })`;
    }
  };

  const head = Object
    .entries(widgets)
    .map(([key, widget]) => `/* ${widget.source} */\nconst ${normalize(key)} = () => ${makeDynamicImport(widget)}\n`)
    .join('\n');

  const newWidgets = { ...widgets };
  Object.entries(newWidgets).forEach(([name, widget]) => {
    widget.module = `@@${normalize(name)}@@`;
  });

  const exportStmt = `export default ${JSON.stringify(newWidgets, undefined, 2)}`
    .replace(/"@@|@@"/g, '');

  return `${head}\n${exportStmt}`;
};

export default widgetsManifestLoader;

function getWidgetId (fn: string) {
  return path.relative('src/widgets', path.dirname(fn));
}

function getSource (fn: string) {
  return path.relative(process.cwd(), fn);
}

function getCssSource (fn: string) {
  fn = fn.replace(/index\.[jt]s$/, 'index.css');
  if (fs.existsSync(fn)) {
    return path.relative(process.cwd(), fn);
  }
  return undefined;
}
