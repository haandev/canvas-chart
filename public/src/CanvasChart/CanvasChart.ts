import { NCanvasChart } from './types'
import { num2sup } from './../utils/index.js'
class CanvasChart {
  public series: NCanvasChart.Series
  public options: NCanvasChart.Options
  public colors: Array<string>
  public xLabels: NCanvasChart.XLabels

  private lineCount: number
  private yLabels: NCanvasChart.YLabels
  private longestSerieLength: number
  private highestValue: number
  private canvasElement: HTMLCanvasElement
  private renderingContext: CanvasRenderingContext2D
  private canvasContainer: HTMLElement | undefined
  private rendered: boolean
  private xLines: Array<NCanvasChart.Line>
  private yLines: Array<NCanvasChart.Line>
  private xStep: number
  private yStep: number
  private yAxisScale: number
  private topValue: number

  constructor(config: NCanvasChart.Interface) {
    const { series, options, colors, xLabels } = config
    this.colors = colors
    this.series = series
    this.xLabels = xLabels
    this.options = {
      ...options,
      width: options.width || 500,
      height: options.height || 150,
      padding: options.padding || 10,
      legendSpace: options.legendSpace || 50,
      yLabelsSpace: options.yLabelsSpace || 50,
      drawYLines: options.drawYLines || true,
      drawXLines: options.drawXLines || false,
      yLabelDigits: options.yLabelDigits || 2,
      lineSpace: options.lineSpace || 10,
      barChartOptions: {
        ...options.barChartOptions,
        serieMargin: options.barChartOptions?.serieMargin || 5,
        stepPadding: options.barChartOptions?.stepPadding || 15,
      },
    }
    this.longestSerieLength = this.calculateLongestSerie()
    this.highestValue = this.calculateLHighestValue()
    this.canvasElement = document.createElement('canvas')
    this.renderingContext = this.canvasElement.getContext('2d')
    this.calculateLHighestValue()
    this.calculateLineCount()
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
    const topValue =
      this.highestValue % this.options.lineSpace === 0
        ? this.highestValue
        : this.highestValue +
          (this.options.lineSpace -
            (this.highestValue % this.options.lineSpace))
    console.log(topValue)
    this.topValue = topValue
    const topValueDigits = String(topValue).length
    this.yAxisScale = 1 / 10 ** (topValueDigits - this.options.yLabelDigits)

    this.lineCount = topValue / this.options.lineSpace
  }
  private initializeDimensions() {
    this.canvasElement.width = this.options.width
    this.canvasElement.height = this.options.height

    this.yStep =
      (this.options.height -
        2 * this.options.padding -
        this.options.legendSpace) /
      this.lineCount

    this.xStep =
      (this.options.width -
        2 * this.options.padding -
        this.options.yLabelsSpace) /
      this.longestSerieLength
  }
  private offsetPoint(
    point: NCanvasChart.Point,
    xOffset: number,
    yOffset: number
  ): NCanvasChart.Point {
    return [point[0] + xOffset, point[1] + yOffset]
  }
  private mapValueToY(value: number): number {
    const gridHeight =
      this.yLines[this.yLines.length - 1][0][1] - this.yLines[0][0][1]
    const topValue = Number(this.yLabels[0])
    const actualSpaceYSize =
      gridHeight * ((topValue - value * this.yAxisScale) / topValue)
    return this.options.padding + actualSpaceYSize
  }
  private mapStepToX(step: number): number {
    return (
      step * this.xStep +
      this.options.yLabelsSpace +
      this.options.padding +
      this.xStep / 2
    )
  }
  private drawRectangle(
    rectangle: NCanvasChart.Rectangle,
    color: string = 'black'
  ) {
    this.renderingContext.fillStyle = color
    this.renderingContext.fillRect(...rectangle[0], ...rectangle[1])
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
  private drawYLines() {
    this.yLines = Array.from({ length: this.lineCount + 1 }, (_, i) => i).map(
      (index: number) => {
        const line: NCanvasChart.Line = [
          [
            this.options.padding + this.options.yLabelsSpace,
            this.options.padding + index * this.yStep,
          ],
          [
            this.options.width - this.options.padding,
            this.options.padding + index * this.yStep,
          ],
        ]
        if (index === 0 || this.options.drawYLines)
          this.drawLine(line as Array<NCanvasChart.Point>, 'gray', 0.5)
        return line
      }
    )
  }
  private drawYLabels() {
    const highestValueCustomDigits = Number(
      String(this.topValue).slice(0, this.options.yLabelDigits)
    )
    const actualLineSpace = this.options.lineSpace * this.yAxisScale
    let next = highestValueCustomDigits
    const yLabels = []
    if (next % actualLineSpace !== 0) {
      next = next + actualLineSpace
    }
    while (next >= 0) {
      yLabels.push(next)
      next = next - actualLineSpace
    }
    console.log('yScale', this.yAxisScale)

    const sup =
      this.yAxisScale !== 1
        ? '*10' +
          num2sup(
            String(
              Math.log10(1 / this.yAxisScale) === 1
                ? ''
                : Math.log10(1 / this.yAxisScale)
            )
          )
        : ''

    this.yLabels = yLabels
    this.yLines.forEach((line, index) => {
      this.drawText(
        String(yLabels[index] + (yLabels[index] !== 0 ? sup : '')),
        this.offsetPoint(line[0], -10, 0)
      )
    })
  }
  private drawXLines() {
    this.xLines = Array.from(
      { length: this.longestSerieLength },
      (_, i) => i
    ).map((index: number) => {
      const line: NCanvasChart.Line = [
        [
          this.options.padding + this.options.yLabelsSpace + index * this.xStep,
          this.options.padding,
        ],
        [
          this.options.padding + this.options.yLabelsSpace + index * this.xStep,
          this.options.height - this.options.padding - this.options.legendSpace,
        ],
      ]
      if (this.options.drawXLines)
        this.drawLine(line as Array<NCanvasChart.Point>, 'silver', 0)
      return line
    })
  }
  private drawXLabels() {
    this.xLabels.forEach((label, step) => {
      this.drawText(
        label,
        [
          this.mapStepToX(step),
          this.options.padding + (this.yLines.length - 1) * this.yStep + 5,
        ],
        'black',
        12,
        'center',
        'top'
      )
    })
  }
  private drawSeriesLineChart() {
    Object.values(this.series).forEach((serie, serieIndex) => {
      const line: NCanvasChart.Line = serie.map((value, pointIndex) => {
        return [this.mapStepToX(pointIndex), this.mapValueToY(value)]
      })
      this.drawLine(line, this.colors[serieIndex] || 'black')
    })
  }
  private calculateLegendWidth(
    iconWidth: number,
    iconMargin: number,
    xMargin: number
  ) {
    this.renderingContext.font = `12px Arial`
    const labels = Object.keys(this.series)
    return (
      this.renderingContext.measureText(labels.join('')).width +
      labels.length * (xMargin * 2 + iconMargin + iconWidth)
    )
  }
  private drawLegendLineChart() {
    const [iconWidth, iconMargin, xMargin] = [30, 5, 20]
    const legendWidth = this.calculateLegendWidth(
      iconWidth,
      iconMargin,
      xMargin
    )
    let legendPointer = (this.options.width-this.options.yLabelsSpace-this.options.padding - legendWidth) / 2 + xMargin + this.options.yLabelsSpace+this.options.padding
    const labels = Object.keys(this.series)
    const legendY = this.options.height - 15
    labels.forEach((label, index) => {
      this.drawLine(
        [
          [legendPointer, legendY],
          [legendPointer + iconWidth, legendY],
        ],
        this.colors[index]
      )
      legendPointer += iconWidth + iconMargin
      this.drawText(
        label,
        [legendPointer, legendY],
        'black',
        12,
        'start',
        'middle'
      )
      legendPointer += this.renderingContext.measureText(label).width + xMargin
    })
  }
  private drawLegendBarChart() {
    const [iconWidth, iconMargin, xMargin] = [12, 5, 20]
    const legendWidth = this.calculateLegendWidth(
      iconWidth,
      iconMargin,
      xMargin
    )
    let legendPointer = (this.options.width-this.options.yLabelsSpace-this.options.padding - legendWidth) / 2 + xMargin + this.options.yLabelsSpace+this.options.padding
    const labels = Object.keys(this.series)
    const legendY = this.options.height - 15
    labels.forEach((label, index) => {
      this.drawRectangle(
        [
          [legendPointer, legendY],
          [iconWidth, 12],
        ],
        this.colors[index]
      )
      legendPointer += iconWidth + iconMargin
      this.drawText(
        label,
        [legendPointer, legendY],
        'black',
        12,
        'start',
        'top'
      )
      legendPointer += this.renderingContext.measureText(label).width + xMargin
    })
  }
  private drawSeriesBarChart() {
    const seriesCount = Object.values(this.series).length
    const stepWidth = this.xStep - 2 * this.options.barChartOptions.stepPadding
    const barWidth =
      (stepWidth -
        (seriesCount - 1) * this.options.barChartOptions.serieMargin) /
      seriesCount

    const barOffset = barWidth + this.options.barChartOptions.serieMargin
    const xOffsetNumber = (-1 * stepWidth) / 2
    console.log(seriesCount, stepWidth, barWidth, xOffsetNumber, barOffset)
    Object.values(this.series).forEach((serie, serieIndex) => {
      serie.forEach((value, pointIndex) => {
        this.drawRectangle(
          [
            [
              this.mapStepToX(pointIndex) +
                xOffsetNumber +
                barOffset * serieIndex,
              this.mapValueToY(value),
            ],
            [
              barWidth,
              this.yLines[this.yLines.length - 1][0][1] -
                this.mapValueToY(value),
            ],
          ],
          this.colors[serieIndex]
        )
      })
    })
  }

  render(canvasContainerId: string, type: NCanvasChart.Type) {
    this.canvasContainer = document.getElementById(canvasContainerId)

    if (!this.canvasContainer) {
      console.log(
        'A container element with the ID you specified was not found.'
      )
      return
    }
    this.initializeDimensions()

    this.drawYLines()
    this.drawXLines()
    this.drawYLabels()
    this.drawXLabels()

    switch (type) {
      case 'bar':
        this.drawSeriesBarChart()
        this.drawLegendBarChart()
        break
      case 'line':
        this.drawSeriesLineChart()
        this.drawLegendLineChart()
        break
      default:
        break
    }
    this.rendered = true
    this.canvasContainer.innerHTML = ''
    this.canvasContainer.appendChild(this.canvasElement)
  }
}

export default CanvasChart
