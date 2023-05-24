import { WidgetMode } from './Widget';
import './index.css';

export { default } from './Widget';

export const preferredSize = {
  width: 1024,
  height: 768,
};

export const defaultProps = {
  currentDb: 'oh-my-github',
  sql: `SELECT 'Hello OSSInsight Lite!'`,
  visualize: {
    type: 'gauge',
    title: 'Greeting',
  },
};

export const configureComponent = () => import('../sql-editor/index')

export const duplicable = true;
