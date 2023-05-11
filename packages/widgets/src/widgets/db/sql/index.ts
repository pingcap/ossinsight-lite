import { WidgetMode } from './Widget';
import './index.css'

export { default } from './Widget';

export const preferredSize = {
  width: 1024,
  height: 768,
};

export const defaultProps = {
  currentDb: 'github-personal',
  sql: `SELECT 'Hello OSSInsight Lite!'`,
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
