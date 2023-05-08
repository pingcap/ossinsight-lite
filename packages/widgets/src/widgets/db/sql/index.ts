export { default } from './Widget';

export const preferredSize = {
  width: 1024,
  height: 768,
};

export const defaultProps = {
  currentDb: 'oh-my-github',
  sql: 'SELECT * FROM curr_user;',
  visualize: {
    type: 'value',
    path: [0, 'followers_count'],
    title: 'Followers Count',
  }
};
