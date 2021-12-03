var CanvasChart = (function () {
    function CanvasChart(config) {
        var series = config.series, options = config.options;
    }
    CanvasChart.prototype.render = function (canvasContainerId) {
        console.log("render method fired to create canvas in element : #".concat(canvasContainerId));
    };
    return CanvasChart;
}());
export default CanvasChart;
