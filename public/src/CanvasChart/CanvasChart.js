var CanvasChart = (function () {
    function CanvasChart(config) {
        var series = config.series, options = config.options;
        this.series = series;
        this.options = options;
        this.longestSerieLength = this.calculateLongestSerie(series);
        this.canvasElement = document.createElement('canvas');
    }
    CanvasChart.prototype.calculateLongestSerie = function (series) {
        return Math.max.apply(Math, Object.values(series).map(function (currentSerie) { return currentSerie.length; }));
    };
    CanvasChart.prototype.render = function (canvasContainerId) {
        this.canvasContainer = document.getElementById(canvasContainerId);
        if (!this.canvasContainer) {
            console.log('A container element with the ID you specified was not found.');
            return;
        }
        this.rendered = true;
        this.canvasContainer.innerHTML = "";
        this.canvasContainer.appendChild(this.canvasElement);
    };
    return CanvasChart;
}());
export default CanvasChart;
