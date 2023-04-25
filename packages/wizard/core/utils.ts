export function getErrorMessage (e: unknown) {
  if (e) {
    if (typeof e === 'object') {
      if ('message' in e) {
        return String(e.message);
      } else {
        return JSON.stringify(e, undefined, 2);
      }
    } else {
      return String(e);
    }
  }
  return `(${e} message)`;
}
