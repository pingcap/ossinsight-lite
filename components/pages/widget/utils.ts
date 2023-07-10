export function shouldWidgetUseCompactModal (name: string) {
  return !name.startsWith('db/sql') && name !== 'markdown'
}