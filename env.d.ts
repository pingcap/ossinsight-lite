declare module '*.sql' {
  const rows: any[]

  export default rows;
}

declare module '*.sql?unique' {
  const row: any

  export default row;
}
