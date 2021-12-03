import { NCanvasChart } from './types'

class CanvasChart {
  private series: NCanvasChart.Series
  private options: NCanvasChart.Options
  private lineCount: number
  private xLabels: NCanvasChart.XLabels
  private yLabels: NCanvasChart.YLabels
  private longestSerieLength: number
  private highestValue: number
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
      width: options.width || 500,
      height: options.height || 150,
      padding: options.padding || 10,
      type: options.type || 'line',
      legendSpace: options.legendSpace || 50,
      yLabelsSpace: options.yLabelsSpace || 25,
      drawXLines: options.drawXLines || true,
      drawYLines: options.drawYLines || false,
      yLabelDigits: options.yLabelDigits || 2,
      lineSpace: options.lineSpace || 10,
    }
    this.longestSerieLength = this.calculateLongestSerie()
    this.highestValue = this.calculateLHighestValue()
    this.canvasElement = document.createElement('canvas')
    this.renderingContext = this.canvasElement.getContext('2d')
  }

  private calculateLongestSerie() {
    return Math.max(
      ...Object.values(this.series).map((currentSerie) => currentSerie.length)
    )
  }
  private calculateLHighestValue() {
    return Math.max(
      ...Object.values(this.series).map((currentSerie) =>
        Math.max(...currentSerie)
      )
    )
  }
  private calculateLineCount() {
    //TODO: this can be automatic, optional
    this.lineCount = this.highestValue / this.options.lineSpace + 1
  }
  private initializeDimensions() {
    this.canvasElement.width = this.options.width
    this.canvasElement.height = this.options.height
  }

  private offsetPoint(
    point: NCanvasChart.Point,
    xOffset: number,
    yOffset: number
  ): NCanvasChart.Point {
    return [point[0] + xOffset, point[1] + yOffset]
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

  private drawText(
    text: string,
    point: NCanvasChart.Point,
    color: string = 'black',
    size: number = 12,
    alignX: NCanvasChart.TextAlignX = 'end',
    alignY: NCanvasChart.TextAlignY = 'middle'
  ) {
    this.renderingContext.strokeStyle = color
    this.renderingContext.textAlign = alignX
    this.renderingContext.font = `${size}px Arial`
    const offsetMapper = {
      bottom: 0,
      top: size,
      middle: size / 2,
    }
    this.renderingContext.fillText(
      text,
      ...this.offsetPoint(point, 0, offsetMapper[alignY])
    )
  }

  private drawYLabels() {
    const highestValueCustomDigits = Number(
      String(this.highestValue).slice(0, this.options.yLabelDigits)
    )
    let next =
      Math.ceil(
        highestValueCustomDigits / 10 ** (this.options.yLabelDigits - 1)
      ) *
      10 ** (this.options.yLabelDigits - 1)
    const yLabels = []
    while (next >= 0) {
      yLabels.push(next)
      next = next - this.options.lineSpace
    }
    this.yLabels = yLabels
    this.xLines.forEach((line, index) => {
      this.drawText(String(yLabels[index]), this.offsetPoint(line[0], -10, 0))
    })
  }

  private drawXLines() {
    const step =
      (this.options.height -
        2 * this.options.padding -
        this.options.legendSpace) /
      this.lineCount
    this.xLines = Array.from({ length: this.lineCount + 1 }, (_, i) => i).map(
      (index: number) => {
        const line: NCanvasChart.Line = [
          [
            this.options.padding + this.options.yLabelsSpace,
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
        this.options.yLabelsSpace) /
      this.longestSerieLength

    this.yLines = Array.from({ length: this.lineCount }, (_, i) => i).map(
      (index: number) => {
        const line: NCanvasChart.Line = [
          [
            this.options.padding + this.options.yLabelsSpace + index * step,
            this.options.padding,
          ],
          [
            this.options.padding + this.options.yLabelsSpace + index * step,
            this.options.height -
              this.options.padding -
              this.options.legendSpace,
          ],
        ]
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
    this.calculateLHighestValue()
    this.calculateLineCount()
    this.drawXLines()
    this.drawYLines()
    this.drawYLabels()
    this.rendered = true
    this.canvasContainer.innerHTML = ''
    this.canvasContainer.appendChild(this.canvasElement)
  }
}

export default CanvasChart
