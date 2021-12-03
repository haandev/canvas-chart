type CanvasChartType = 'bar' | 'line'

type CanvasChartSeries = {
  [key: string]: Array<number>
}

type CanvasChartOptions = {
  lines: number
  height: number
  width: number
  type: CanvasChartType
}

interface CanvasChartConfig {
  series?: CanvasChartSeries
  options: CanvasChartOptions
}

export interface ICanvasChart extends CanvasChartConfig {}
