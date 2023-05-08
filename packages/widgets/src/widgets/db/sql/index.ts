import { WidgetMode } from './Widget';

export { default } from './Widget';

export const preferredSize = {
  width: 1024,
  height: 768,
};

export const defaultProps = {
  currentDb: 'oh-my-github',
  sql: 'SELECT followers_count FROM curr_user;',
  visualize: {
    type: 'gauge',
    title: 'Followers Count',
  }
};

export const configurable = true;
export const configurablePropsOverwrite = {
  mode: WidgetMode.EDITOR,
}