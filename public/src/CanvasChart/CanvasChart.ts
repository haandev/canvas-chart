import { ICanvasChart } from './types'

class CanvasChart {
  constructor(config: ICanvasChart) {
    const { series, options } = config
  }
  render(canvasContainerId: string) {
    console.log(
      `render method fired to create canvas in element : #${canvasContainerId}`
    )
  }
}

export default CanvasChart
