export type VisualizeRuntimeProps = {
  result: any
  running: any
}

export type VisualizeConfigProps = {
  columns: { name: string }[] | undefined
  running: any
  portal?: HTMLDivElement | null
  onPropChange: (key: Exclude<keyof VisualizeType, 'type'>, value: any) => void;
  onTypeChange: (type: VisualizeType['type']) => void;
}

export type VisualizeType = VisualizeValue;

export type VisualizeValue = {
  type: 'value'
  path: (string | number)[]
  title: string
}

export function getValue (result: any, path: (string | number)[]) {
  return path.reduce((value, index) => value?.[index], result);
}
