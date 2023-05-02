declare global {
  type Process = {
    readonly env: {
      [key: string]: string
      NODE_ENV: 'production' | 'development'
      OSSW_SITE_DOMAIN: string
    }
  }

  export const process: Process;
}

export {};
