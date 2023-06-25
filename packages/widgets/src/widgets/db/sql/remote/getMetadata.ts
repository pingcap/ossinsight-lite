import { Metadata } from 'next';
import { ServerContext } from '../../../../../../../core/widgets-manifest';
import cu from '../../../oh-my-github/curr_user.sql?unique';
import { ConfigJson, getGithubContentUrl } from './utils';
import { WidgetProps } from './Widget';

export default async function getMetadata (server: ServerContext, props: WidgetProps): Promise<Metadata> {
  const base = getGithubContentUrl(props);

  const config = await fetch(`${base}config.json`).then(res => res.json() as Promise<ConfigJson>);

  const title = `${config.title} | ${cu.login}'s Dashboard`;
  const description = `OSSInsight Lite | ${config.description}`;
  const keywords = [...(config.keywords ?? []), 'OSSInsight Lite', 'GitHub', 'Personal Dashboard', title];
  const imageUrl = `/widgets/${encodeURIComponent(server.widgetId)}/thumbnail.png`;

  return {
    title,
    description,
    keywords,
    colorScheme: 'light',
    openGraph: {
      title,
      description,
      images: [imageUrl],
    },
    twitter: {
      title,
      description,
      images: [imageUrl],
      card: 'summary_large_image',
    },
  };
}