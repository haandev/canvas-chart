var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var CanvasChart = (function () {
    function CanvasChart(config) {
        var series = config.series, options = config.options;
        this.series = series;
        this.options = __assign(__assign({}, options), { padding: options.padding || 10, lines: options.lines || 5, type: options.type || 'line', legendSpace: options.legendSpace || 50, xLabelsSpace: options.xLabelsSpace || 25, drawXLines: options.drawXLines || true, drawYLines: options.drawYLines || false });
        this.longestSerieLength = this.calculateLongestSerie();
        this.canvasElement = document.createElement('canvas');
        this.renderingContext = this.canvasElement.getContext('2d');
    }
    CanvasChart.prototype.calculateLongestSerie = function () {
        return Math.max.apply(Math, Object.values(this.series).map(function (currentSerie) { return currentSerie.length; }));
    };
    CanvasChart.prototype.initializeDimensions = function () {
        this.canvasElement.width = this.options.width;
        this.canvasElement.height = this.options.height;
    };
    CanvasChart.prototype.drawLine = function (line, color, width) {
        var _a;
        var _this = this;
        if (color === void 0) { color = 'gray'; }
        if (width === void 0) { width = 2; }
        this.renderingContext.strokeStyle = color;
        this.renderingContext.lineWidth = width;
        this.renderingContext.beginPath();
        (_a = this.renderingContext).moveTo.apply(_a, line[0]);
        var otherPoints = line.slice(1);
        otherPoints.forEach(function (point) {
            var _a;
            (_a = _this.renderingContext).lineTo.apply(_a, point);
        });
        this.renderingContext.stroke();
    };
    CanvasChart.prototype.drawXLines = function () {
        var _this = this;
        var step = (this.options.height -
            2 * this.options.padding -
            this.options.legendSpace) /
            (this.options.lines - 1);
        this.xLines = Array.from({ length: this.options.lines }, function (_, i) { return i; }).map(function (index) {
            var line = [
                [
                    _this.options.padding + _this.options.xLabelsSpace,
                    _this.options.padding + index * step,
                ],
                [
                    _this.options.width - _this.options.padding,
                    _this.options.padding + index * step,
                ],
            ];
            if (index === 0 || _this.options.drawXLines)
                _this.drawLine(line, 'gray', 0.5);
            return line;
        });
    };
    CanvasChart.prototype.drawYLines = function () {
        var _this = this;
        var step = (this.options.width -
            2 * this.options.padding -
            this.options.xLabelsSpace) /
            this.longestSerieLength;
        this.yLines = Array.from({ length: this.options.lines }, function (_, i) { return i; }).map(function (index) {
            var line = [
                [
                    _this.options.padding + _this.options.xLabelsSpace + index * step,
                    _this.options.padding,
                ],
                [
                    _this.options.padding + _this.options.xLabelsSpace + index * step,
                    _this.options.height -
                        _this.options.padding -
                        _this.options.legendSpace,
                ],
            ];
            console.log(_this.drawYLines);
            if (_this.options.drawYLines)
                _this.drawLine(line, 'silver', 0);
            return line;
        });
    };
    CanvasChart.prototype.render = function (canvasContainerId) {
        this.canvasContainer = document.getElementById(canvasContainerId);
        if (!this.canvasContainer) {
            console.log('A container element with the ID you specified was not found.');
            return;
        }
        this.initializeDimensions();
        this.drawXLines();
        this.drawYLines();
        this.rendered = true;
        this.canvasContainer.innerHTML = '';
        this.canvasContainer.appendChild(this.canvasElement);
    };
    return CanvasChart;
}());
export default CanvasChart;
