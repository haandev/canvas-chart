import { NCanvasChart } from './types'

class CanvasChart {
  private series: NCanvasChart.Series
  private options: NCanvasChart.Options
  private xLabels: NCanvasChart.XLabels
  private longestSerieLength: number
  private canvasElement: HTMLCanvasElement
  private renderingContext: CanvasRenderingContext2D
  private canvasContainer: HTMLElement | undefined
  private rendered: boolean
  private xLines: Array<NCanvasChart.Line>
  private yLines: Array<NCanvasChart.Line>

  constructor(config: NCanvasChart.Interface) {
    const { series, options } = config
    this.series = series
    this.options = {
      ...options,
      padding: options.padding || 10,
      lines: options.lines || 5,
      type: options.type || 'line',
      legendSpace: options.legendSpace || 50,
      xLabelsSpace: options.xLabelsSpace || 25,
      drawXLines: options.drawXLines || true,
      drawYLines: options.drawYLines || false,
    }
    this.longestSerieLength = this.calculateLongestSerie()
    this.canvasElement = document.createElement('canvas')
    this.renderingContext = this.canvasElement.getContext('2d')
  }

  private calculateLongestSerie() {
    return Math.max(
      ...Object.values(this.series).map((currentSerie) => currentSerie.length)
    )
  }
  private initializeDimensions() {
    this.canvasElement.width = this.options.width
    this.canvasElement.height = this.options.height
  }
  private drawLine(
    line: NCanvasChart.Line,
    color: string = 'gray',
    width: number = 2
  ) {
    this.renderingContext.strokeStyle = color
    this.renderingContext.lineWidth = width
    this.renderingContext.beginPath()
    this.renderingContext.moveTo(...line[0])
    const otherPoints = line.slice(1)
    otherPoints.forEach((point) => {
      this.renderingContext.lineTo(...point)
    })
    this.renderingContext.stroke()
  }
  private drawXLines() {
    const step =
      (this.options.height -
        2 * this.options.padding -
        this.options.legendSpace) /
      (this.options.lines - 1)
    this.xLines = Array.from({ length: this.options.lines }, (_, i) => i).map(
      (index: number) => {
        const line: NCanvasChart.Line = [
          [
            this.options.padding + this.options.xLabelsSpace,
            this.options.padding + index * step,
          ],
          [
            this.options.width - this.options.padding,
            this.options.padding + index * step,
          ],
        ]
        if (index === 0 || this.options.drawXLines)
          this.drawLine(line as Array<NCanvasChart.Point>, 'gray', 0.5)
        return line
      }
    )
  }
  private drawYLines() {
    const step =
      (this.options.width -
        2 * this.options.padding -
        this.options.xLabelsSpace) /
      this.longestSerieLength

    this.yLines = Array.from({ length: this.options.lines }, (_, i) => i).map(
      (index: number) => {
        const line: NCanvasChart.Line = [
          [
            this.options.padding + this.options.xLabelsSpace + index * step,
            this.options.padding,
          ],
          [
            this.options.padding + this.options.xLabelsSpace + index * step,
            this.options.height -
              this.options.padding -
              this.options.legendSpace,
          ],
        ]
        console.log(this.drawYLines)
        if (this.options.drawYLines)
          this.drawLine(line as Array<NCanvasChart.Point>, 'silver', 0)
        return line
      }
    )
  }

  render(canvasContainerId: string) {
    this.canvasContainer = document.getElementById(canvasContainerId)

    if (!this.canvasContainer) {
      console.log(
        'A container element with the ID you specified was not found.'
      )
      return
    }
    this.initializeDimensions()
    this.drawXLines()
    this.drawYLines()
    this.rendered = true
    this.canvasContainer.innerHTML = ''
    this.canvasContainer.appendChild(this.canvasElement)
  }
}

export default CanvasChart
