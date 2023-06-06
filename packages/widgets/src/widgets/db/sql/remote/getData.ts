import { ServerContext } from '../../../../../../../core/widgets-manifest';
import { ConfigJson } from './utils';
import { WidgetProps } from './Widget';

export default async function getData (server: ServerContext, { owner, repo, branch, name }: WidgetProps) {
  const base = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/collections/${name}/`;

  const configPromise = fetch(`${base}config.json`).then(res => res.json() as Promise<ConfigJson>);
  const sqlPromise = fetch(`${base}template.sql`).then(res => res.text());

  const [config, sql] = await Promise.all([configPromise, sqlPromise]);

  return await server.runSql(config.database, sql);
}
