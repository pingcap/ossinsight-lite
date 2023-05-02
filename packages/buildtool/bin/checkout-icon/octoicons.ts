import icons, { IconName, SVGOptions } from '@primer/octicons';

import * as yup from 'yup';
import path from 'path';
import fsp from 'fs/promises';
import { svgOptionsSchema } from './options.js';

export async function checkout (name: string, rawOption: Record<string, any> = {}) {
  const icon = icons[name as IconName];
  const options = await svgOptionsSchema.validate(rawOption);
  if (!icon) {
    throw new Error(`octicons ${name} not exists`);
  }
  const svgOptions = {
    width: options.size ?? options.width,
    height: options.size ?? options.height,
    'aria-label': options.label,
    class: options.className,
  }

  for (const key of Object.keys(svgOptions)) {
    if (svgOptions[key as keyof SVGOptions] == null) {
      delete svgOptions[key as keyof SVGOptions]
    }
  }

  const svg = icon.toSVG();

  const fn = path.join(options.path, name + '.svg');
  await fsp.mkdir(path.dirname(fn), { recursive: true });
  await fsp.writeFile(fn, svg);
  return fn;
}

export async function list () {
  return Object.keys(icons);
}
