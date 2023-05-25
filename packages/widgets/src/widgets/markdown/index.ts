export { default } from './Markdown';

export const configureComponent = () => import('./MarkdownEditor');
export const duplicable = true;
export const styleConfigurable = true;

export const defaultProps = {
  markdown: '# Hello OSSInsight Lite!'
}

export { NewButton } from './NewButton';

// defaultRect?: Rect;
// defaultProps?: Partial<P>,

// export const category = '';
export const displayName = 'Markdown';
