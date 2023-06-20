export enum SiteWarnings {
  NEED_RESET_PASSWORD = 'NEED_RESET_PASSWORD',
}

export const authenticatedWarnings = new Set([
  SiteWarnings.NEED_RESET_PASSWORD,
])
