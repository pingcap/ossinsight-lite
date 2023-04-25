import widgets from 'app:widgets-manifest';
import { PageContext } from '../../renderer/types';

export default (pageContext: PageContext) => {
  return pageContext.urlPathname.slice(1) in widgets;
}
