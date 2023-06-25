import './index.css';

export const Widget = () => import('./Widget');
export const WidgetDetails = () => import('./WidgetDetails');
export const ConfigureComponent = () => import('./Editor');

export const Icon = () => import('./Icon');

export const createPngThumbnail = () => import('./createPngThumbnail');

export const getData = () => import('./getData');
export const getMetadata = () => import('./getMetadata');

export const preferredSize = {
  width: 1024,
  height: 768,
};

export const defaultProps = {
  currentDb: 'oh-my-github',
  sql: `SELECT language, COUNT(*) AS cnt
FROM repos
WHERE language IS NOT NULL
GROUP BY language
ORDER BY cnt DESC
LIMIT 5`,
  visualize: {
    type: 'chart:bar',
    title: 'Top 5 Repo languages',
    x: {
      type: 'value',
      field: 'cnt',
      label: 'Repo Count'
    },
    y: {
      type: 'category',
      field: 'language',
      label: 'Language',
    }
  },
  showBorder: true,
};

export const styleConfigurable = ['showBorder'];

export const shareable = true;

export const duplicable = true;

export const category = 'SQL';

export const displayName = 'SQL Chart';
