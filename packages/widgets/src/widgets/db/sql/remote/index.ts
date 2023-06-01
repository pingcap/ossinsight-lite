export const Widget = () => import('./Widget');

export const ConfigureComponent = () => import('./ConfigureComponent');

export const Icon = () => import('./Icon');

export const defaultProps = {
  owner: 'pingcap',
  repo: 'ossinsight-lite',
  branch: 'main',
  name: 'contribution-monthly',
};

export const duplicable = true;

export const category = 'SQL';
export const displayName = 'Remote SQL Chart';
