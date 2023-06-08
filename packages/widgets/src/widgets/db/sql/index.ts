import './index.css';

export const Widget = () => import('./Widget');
export const WidgetDetails = () => import('./WidgetDetails');
export const ConfigureComponent = () => import('./Editor');

export const Icon = () => import('./Icon');

export const createPngThumbnail = () => import('./createPngThumbnail');

export const getData = () => import('./getData');

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
  showBorder: true,
};

export const styleConfigurable = ['showBorder'];

export const duplicable = true;

export const category = 'SQL';

export const displayName = 'SQL Chart';
