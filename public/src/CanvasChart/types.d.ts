export namespace NCanvasChart {
  type Type = 'bar' | 'line'
  type Series = {
    [key: string]: Array<number>
  }
  type Options = {
    height: number
    width: number
    padding?: number
    legendSpace?: number
    yLabelsSpace?: number
    drawXLines?: boolean
    drawYLines?: boolean
    yLabelDigits?: number
    lineSpace?: number
    barChartOptions?: {
      serieMargin: number
      stepPadding: number
    }
  }
  type XLabels = Array<string>
  type YLabels = Array<number>
  type Point = [number, number]
  type Rectangle = [Point, Point]
  type Line = Array<Point>
  type TextAlignX = 'start' | 'left' | 'end' | 'right' | 'center'
  type TextAlignY = 'bottom' | 'top' | 'middle'
  interface Config {
    series?: Series
    options: Options
    xLabels: XLabels
    colors?: Array<string>
  }
  interface Interface extends Config {}
}
