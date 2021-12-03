export namespace NCanvasChart {
  type Type = 'bar' | 'line'
  type Series = {
    [key: string]: Array<number>
  }
  type Options = {
    height: number
    width: number
    type?: Type
    padding?: number
    legendSpace?: number
    yLabelsSpace?: number
    drawXLines?: boolean
    drawYLines?: boolean
    yLabelDigits?: number
    lineSpace?: number
  }
  type XLabels = Array<string>
  type YLabels = Array<number>
  type Point = [number, number]
  type Line = Array<Point>
  type TextAlignX = 'start' | 'left' | 'end' | 'right' | 'center'
  type TextAlignY = 'bottom' | 'top' | "middle"
  interface Config {
    series?: Series
    options: Options
    xLabels: XLabels
  }
  interface Interface extends Config {}
}
