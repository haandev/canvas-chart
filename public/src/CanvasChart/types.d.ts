export namespace NCanvasChart {
  type Type = 'bar' | 'line'
  type Series = {
    [key: string]: Array<number>
  }
  type Options = {
    lines?: number
    height: number
    width: number
    type?: Type
    padding?: number
    legendSpace?: number
    xLabelsSpace?: number
    drawXLines?: boolean
    drawYLines?: boolean
  }
  type XLabels = Array<string>
  type Point = [number, number]
  type Line = Array<Point>
  interface Config {
    series?: Series
    options: Options
    xLabels: XLabels
  }
  interface Interface extends Config {}
}
