import { globSync } from 'glob';
import * as path from 'node:path';
import { LoaderDefinitionFunction } from 'webpack';

type Widgets = Record<string, Widget>
type Widget = {
  source: string
}

const widgetsManifestLoader: LoaderDefinitionFunction = function (content, map, meta) {
  const paths = globSync('packages/widgets/src/widgets/*/**/index.ts');

  const widgets: Widgets = {};
  this.cacheable(false);

  paths.forEach(fn => {
    widgets[getWidgetId(fn)] = {
      source: getSource(fn),
    };
  });

  function normalize (name: string) {
    return name
      .replace(/\//g, '__')
      .replace(/-/g, '_');
  }

  const head = Object
    .entries(widgets)
    .map(([key, widget]) => `import * as ${normalize(key)} from ${JSON.stringify(widget.source)};\n`)
    .join('\n');

  let body = 'const widgets = {};\n\n';

  Object.keys(widgets).forEach((key) => {
    body += `widgets[${JSON.stringify(key)}] = ${normalize(key)}\n`;
  });

  body += `export default widgets`;

  return `/* GENERATED */\n\n${head}\n${body}`;
};

export = widgetsManifestLoader;

function getWidgetId (fn: string) {
  return path.relative('packages/widgets/src/widgets', path.dirname(fn));
}

function getSource (fn: string) {
  return path.relative(process.cwd(), fn);
}
