export const Widget = () => import('./Markdown');
export const ConfigureComponent = () => import('./MarkdownEditor');

export const Icon = () => import('./Icon');

export const duplicable = true;

export const defaultProps = {
  markdown: '# Hello OSSInsight Lite!',
};

// defaultProps?: Partial<P>,

// export const category = '';
export const displayName = 'Markdown';
