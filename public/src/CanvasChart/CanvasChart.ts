import { CanvasChartOptions, CanvasChartSeries, ICanvasChart } from './types'

class CanvasChart {
  private series: CanvasChartSeries
  private options: CanvasChartOptions
  private longestSerieLength: number
  private canvasElement: HTMLCanvasElement
  private canvasContainer: HTMLElement | undefined
  private rendered: boolean

  constructor(config: ICanvasChart) {
    const { series, options } = config
    this.series = series
    this.options = options
    this.longestSerieLength = this.calculateLongestSerie(series)
    this.canvasElement = document.createElement('canvas')
  }

  calculateLongestSerie(series: CanvasChartSeries) {
    return Math.max(
      ...Object.values(series).map((currentSerie) => currentSerie.length)
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

    this.rendered = true
    this.canvasContainer.innerHTML=""
    this.canvasContainer.appendChild(this.canvasElement)
  }
}

export default CanvasChart
