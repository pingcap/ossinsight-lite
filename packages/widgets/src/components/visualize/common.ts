export type VisualizeRuntimeProps = {
  result: any
  running: any
}

export type VisualizeConfigProps = {
  columns: { name: string }[] | undefined
  running: any
  portal?: HTMLDivElement | null
}

export type VisualizeType =
  VisualizeTable |
  VisualizeGauge |
  VisualizeLineChart |
  VisualizeBarChart;

export type VisualizeTable = {
  type: 'table'
  title: string
}

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

export type VisualizeXYChart = {
  title: string
  x: Axis
  y: Axis
}

export type VisualizeLineChart = VisualizeXYChart & {
  type: 'chart:line'
}

export type VisualizeBarChart = VisualizeXYChart & {
  type: 'chart:bar'
}

export function getValue (result: any, path: (string | number)[]) {
  return path.reduce((value, index) => value?.[index], result);
}
