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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var CanvasChart = (function () {
    function CanvasChart(config) {
        var series = config.series, options = config.options, colors = config.colors;
        this.colors = colors;
        this.series = series;
        this.options = __assign(__assign({}, options), { width: options.width || 500, height: options.height || 150, padding: options.padding || 10, type: options.type || 'line', legendSpace: options.legendSpace || 50, yLabelsSpace: options.yLabelsSpace || 25, drawYLines: options.drawYLines || true, drawXLines: options.drawXLines || false, yLabelDigits: options.yLabelDigits || 2, lineSpace: options.lineSpace || 10 });
        this.longestSerieLength = this.calculateLongestSerie();
        this.highestValue = this.calculateLHighestValue();
        this.canvasElement = document.createElement('canvas');
        this.renderingContext = this.canvasElement.getContext('2d');
        this.yAxisScale = 1 / Math.pow(10, (this.options.yLabelDigits - 1));
    }
    CanvasChart.prototype.calculateLongestSerie = function () {
        return Math.max.apply(Math, Object.values(this.series).map(function (currentSerie) { return currentSerie.length; }));
    };
    CanvasChart.prototype.calculateLHighestValue = function () {
        return Math.max.apply(Math, Object.values(this.series).map(function (currentSerie) {
            return Math.max.apply(Math, currentSerie);
        }));
    };
    CanvasChart.prototype.calculateLineCount = function () {
        this.lineCount = this.highestValue / this.options.lineSpace + 1;
    };
    CanvasChart.prototype.initializeDimensions = function () {
        this.canvasElement.width = this.options.width;
        this.canvasElement.height = this.options.height;
    };
    CanvasChart.prototype.offsetPoint = function (point, xOffset, yOffset) {
        return [point[0] + xOffset, point[1] + yOffset];
    };
    CanvasChart.prototype.mapValueToY = function (value) {
        var gridHeight = this.xLines[this.xLines.length - 1][0][1] - this.xLines[0][0][1];
        var topValue = Number(this.yLabels[0]);
        var actualSpaceYSize = gridHeight * ((topValue - value * this.yAxisScale) / topValue);
        return this.options.padding + actualSpaceYSize;
    };
    CanvasChart.prototype.mapStepToX = function (step) {
        return step * this.xStep + this.options.yLabelsSpace + this.options.padding;
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
    CanvasChart.prototype.drawText = function (text, point, color, size, alignX, alignY) {
        var _a;
        if (color === void 0) { color = 'black'; }
        if (size === void 0) { size = 12; }
        if (alignX === void 0) { alignX = 'end'; }
        if (alignY === void 0) { alignY = 'middle'; }
        this.renderingContext.strokeStyle = color;
        this.renderingContext.textAlign = alignX;
        this.renderingContext.font = "".concat(size, "px Arial");
        var offsetMapper = {
            bottom: 0,
            top: size,
            middle: size / 2,
        };
        (_a = this.renderingContext).fillText.apply(_a, __spreadArray([text], this.offsetPoint(point, 0, offsetMapper[alignY]), false));
    };
    CanvasChart.prototype.drawYLabels = function () {
        var _this = this;
        var highestValueCustomDigits = Number(String(this.highestValue).slice(0, this.options.yLabelDigits));
        var actualLineSpace = this.options.lineSpace * this.yAxisScale;
        var next = Math.ceil(highestValueCustomDigits * this.yAxisScale) / this.yAxisScale;
        var yLabels = [];
        if (next % actualLineSpace !== 0) {
            next = next + actualLineSpace;
        }
        while (next >= 0) {
            yLabels.push(next);
            next = next - actualLineSpace;
        }
        this.yLabels = yLabels;
        this.xLines.forEach(function (line, index) {
            _this.drawText(String(yLabels[index]), _this.offsetPoint(line[0], -10, 0));
        });
    };
    CanvasChart.prototype.drawYLines = function () {
        var _this = this;
        var step = (this.options.height -
            2 * this.options.padding -
            this.options.legendSpace) /
            this.lineCount;
        this.xLines = Array.from({ length: this.lineCount + 1 }, function (_, i) { return i; }).map(function (index) {
            var line = [
                [
                    _this.options.padding + _this.options.yLabelsSpace,
                    _this.options.padding + index * step,
                ],
                [
                    _this.options.width - _this.options.padding,
                    _this.options.padding + index * step,
                ],
            ];
            if (index === 0 || _this.options.drawYLines)
                _this.drawLine(line, 'gray', 0.5);
            return line;
        });
    };
    CanvasChart.prototype.drawXLines = function () {
        var _this = this;
        var step = (this.options.width -
            2 * this.options.padding -
            this.options.yLabelsSpace) /
            (this.longestSerieLength - 1);
        this.xStep = step;
        this.yLines = Array.from({ length: this.longestSerieLength }, function (_, i) { return i; }).map(function (index) {
            var line = [
                [
                    _this.options.padding + _this.options.yLabelsSpace + index * step,
                    _this.options.padding,
                ],
                [
                    _this.options.padding + _this.options.yLabelsSpace + index * step,
                    _this.options.height - _this.options.padding - _this.options.legendSpace,
                ],
            ];
            if (_this.options.drawXLines)
                _this.drawLine(line, 'silver', 0);
            return line;
        });
    };
    CanvasChart.prototype.drawSeries = function () {
        var _this = this;
        Object.values(this.series).forEach(function (serie, serieIndex) {
            var line = serie.map(function (value, pointIndex) {
                return [_this.mapStepToX(pointIndex), _this.mapValueToY(value)];
            });
            _this.drawLine(line, _this.colors[serieIndex] || 'black');
        });
    };
    CanvasChart.prototype.render = function (canvasContainerId) {
        this.canvasContainer = document.getElementById(canvasContainerId);
        if (!this.canvasContainer) {
            console.log('A container element with the ID you specified was not found.');
            return;
        }
        this.initializeDimensions();
        this.calculateLHighestValue();
        this.calculateLineCount();
        this.drawYLines();
        this.drawXLines();
        this.drawYLabels();
        this.drawSeries();
        this.rendered = true;
        this.canvasContainer.innerHTML = '';
        this.canvasContainer.appendChild(this.canvasElement);
    };
    return CanvasChart;
}());
export default CanvasChart;
