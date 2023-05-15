export type Version = {
  version: string | number

  migrate: (previous: any) => any
}

export type Fixup = (previous: any) => any;
