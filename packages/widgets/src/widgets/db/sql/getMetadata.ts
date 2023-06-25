import { Metadata } from 'next';
import { ServerContext } from '../../../../../../core/widgets-manifest';
import cu from '../../oh-my-github/curr_user.sql?unique';
import { WidgetProps } from './Widget';

export default async function getMetadata (server: ServerContext, props: WidgetProps): Promise<Metadata> {
  const formattedSql = props.sql!.replace(/\n/g, ' ').replace(/\s+/g, ' ');

  const title = `${props.title ?? 'Custom SQL'} | ${cu.login}'s Dashboard`;
  const description = `OSSInsight Lite | ${formattedSql}`;
  const keywords = ['OSSInsight Lite', 'GitHub', 'Personal Dashboard', title];
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