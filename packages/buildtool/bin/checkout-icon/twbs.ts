import icons, { SVGOptions } from '@primer/octicons';
import path from 'path';
import fsp from 'fs/promises';
import { svgOptionsSchema } from './options.js';
import { dep } from '../../webpack/utils/path.js';

export async function checkout (name: string, rawOption: Record<string, any> = {}) {
  const content = await fsp.readFile(path.join(dep('bootstrap-icons'), 'icons', name + '.svg'));
  const options = await svgOptionsSchema.validate(rawOption);

  const svgOptions = {
    width: options.size ?? options.width,
    height: options.size ?? options.height,
    'aria-label': options.label,
    class: options.className,
  };

  for (const key of Object.keys(svgOptions)) {
    if (svgOptions[key as keyof SVGOptions] == null) {
      delete svgOptions[key as keyof SVGOptions];
    }
  }

  if (svgOptions.height || svgOptions.height || svgOptions.class || svgOptions['aria-label']) {
    throw new Error('Option does not support');
  }

  const fn = path.join(options.path, 'twbs', name + '.svg');
  await fsp.mkdir(path.dirname(fn), { recursive: true });
  await fsp.writeFile(fn, content);
  return fn;
}

export async function list () {
  return Object.keys(icons);
}
