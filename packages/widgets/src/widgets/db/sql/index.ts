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

export const configureComponent = () => import('./Editor');

export { NewButton } from './NewButton';

export const duplicable = true;

export const category = 'SQL';

export const displayName = 'Chart';
