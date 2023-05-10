import { WidgetMode } from './Widget';

export { default } from './Widget';

export const preferredSize = {
  width: 1024,
  height: 768,
};

export const defaultProps = {
  currentDb: 'oh-my-github',
  sql: `SELECT 'Hello OSSWidgets!'`,
  visualize: {
    type: 'gauge',
    title: 'Greeting',
  },
  mode: 'visualization',
};

export const configurable = true;
export const configurablePropsOverwrite = {
  mode: WidgetMode.EDITOR,
}
