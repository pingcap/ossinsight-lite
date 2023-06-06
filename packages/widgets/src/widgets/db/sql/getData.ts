import { ServerContext } from '../../../../../../core/widgets-manifest';
import { WidgetProps } from './Widget';

export default async function getData (server: ServerContext, props: WidgetProps, ) {
  return await server.runSql(props.currentDb, props.sql);
}
