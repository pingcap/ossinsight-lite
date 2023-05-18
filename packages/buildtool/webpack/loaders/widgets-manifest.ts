import { LoaderDefinitionFunction } from 'webpack';
import { globSync } from 'glob';
import * as path from 'node:path';
import * as fs from 'node:fs';

type Widgets = Record<string, Widget>
type Widget = {
  module?: string
  source: string
  cssSource: string | undefined
}

const widgetsManifestLoader: LoaderDefinitionFunction = function (content, map, meta) {
  const paths = globSync('packages/widgets/src/widgets/*/**/index.ts');

  const widgets: Widgets = {};
  this.cacheable(false);

  paths.forEach(fn => {
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
      return `\n  import('@/${module.cssSource}', { assert: { type: 'css' } })\n    .then(() => import('@/${module.source}', { assert: { type: 'javascript' } }))`;
    } else {
      return `import('@/${module.source}', { assert: { type: 'javascript' } })`;
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

  return `/* GENERATED */\n\n${head}\n${exportStmt}`;
};

export = widgetsManifestLoader;

function getWidgetId (fn: string) {
  return path.relative('packages/widgets/src/widgets', path.dirname(fn));
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
