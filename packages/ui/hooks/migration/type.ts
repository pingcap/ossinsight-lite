export type Version = {
  version: string | number

  migrate: (previous: any) => any
}
