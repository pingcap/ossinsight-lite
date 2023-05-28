const NONCE_CHARS = 'abcdefghijklmnopqrstuvwxyz1234567890-=!@#$%^&*()_+[]\\{}|;\':",./<>?`~';

export function nonce (len: number) {
  let s = '';
  for (let i = 0; i < len; i++) {
    s += NONCE_CHARS[Math.round(Math.random() * NONCE_CHARS.length)];
  }
  return s;
}
