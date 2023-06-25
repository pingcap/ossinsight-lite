export const Widget = () => import('./Widget');

// export const ConfigureComponent = () => import('./ConfigureComponent');

export const Icon = () => import('./Icon');

export const getData = () => import('./getData');

export const getMetadata = () => import('./getMetadata');

export const createPngThumbnail = () => import('./createPngThumbnail');

export const defaultProps = {
  owner: 'pingcap',
  repo: 'ossinsight-lite',
  branch: 'main',
  name: 'contribution-monthly',
  showBorder: true,
};

export const styleConfigurable = ['showBorder'];

export const shareable = true;
// export const duplicable = true;
export const deletable = false;

export const category = 'SQL';
export const displayName = 'Remote SQL Chart';
