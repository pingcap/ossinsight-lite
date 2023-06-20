export enum SiteWarnings {
  NEED_RESET_PASSWORD = 'NEED_RESET_PASSWORD',
  NEED_RESET_JWT_SECRET = 'NEED_RESET_JWT_SECRET',
}

export const authenticatedWarnings = new Set([
  SiteWarnings.NEED_RESET_JWT_SECRET,
  SiteWarnings.NEED_RESET_PASSWORD,
])
