export function isNonEmptyString (v: unknown): v is string {
  return !!v && typeof v === 'string';
}
