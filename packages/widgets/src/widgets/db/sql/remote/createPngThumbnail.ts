import { Chart as ChartJs, registerables } from 'chart.js';
import 'chartjs-adapter-luxon';
import * as colors from 'tailwindcss/colors';
import { ServerContext } from '../../../../../../../core/widgets-manifest';
import getData from './getData';
import { WidgetProps } from './Widget';

ChartJs.register(
  ...registerables,
);

ChartJs.defaults.animation = false;

export default async function (server: ServerContext, { owner, repo, branch, name }: WidgetProps, ctx: CanvasRenderingContext2D) {
  const dataPromise = getData(server, { owner, repo, branch, name });
  const base = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/collections/${name}/`;
  const visScriptPromise = fetch(base + 'visualization.js');
  const [data, visScript] = await Promise.all([dataPromise, visScriptPromise]);
  let script = await visScript.text();

  script = script.replace('export default function', 'const __vis__ = function');
  script += `

  return __vis__(__arg0, __arg1)`;

  const func = new Function('__arg0', '__arg1', script);
  const visualResult = func(data.data, { colors });

  new ChartJs(ctx, {
    ...visualResult,
  });
}
