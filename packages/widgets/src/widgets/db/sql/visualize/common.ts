export type VisualizeRuntimeProps = {
  result: any
  running: any
}

export type VisualizeConfigProps = {
  columns: { name: string }[] | undefined
  running: any
  portal?: HTMLDivElement | null
}

export type VisualizeType = VisualizeGauge | VisualizeLineChart;

export type VisualizeGauge = {
  type: 'gauge'
  title: string
}

export type Axis = {
  type: 'category' | 'value' | 'datetime' | 'day' | 'month' | 'year'
  field: string
  label?: string
  color?: string
}

export type VisualizeLineChart = {
  type: 'chart:line'
  title: string
  x: Axis
  y: Axis
}

export function getValue (result: any, path: (string | number)[]) {
  return path.reduce((value, index) => value?.[index], result);
}
