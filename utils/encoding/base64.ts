export function encodeBase64Url (data: string) {

  return btoa(data)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

export function decodeBase64Url (data: string) {
  return atob(data.replace(/-/g, '+')
    .replace(/_/g, '/')
    .padEnd(data.length + (4 - data.length % 4) % 4, '='));
}
