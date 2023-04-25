import widgets from 'app:widgets-manifest';

export function prerender () {
  return Object.keys(widgets).map(w => '/' + w)
}
