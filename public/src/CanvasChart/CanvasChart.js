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
import { num2sup, closestNumber } from './../utils/index.js';
var CanvasChart = (function () {
    function CanvasChart(config) {
        var _a, _b;
        var series = config.series, options = config.options, colors = config.colors, xLabels = config.xLabels;
        this.colors = colors;
        this.series = series;
        this.xLabels = xLabels;
        this.options = __assign(__assign({}, options), { width: options.width || 500, height: options.height || 150, padding: options.padding || 10, legendSpace: options.legendSpace || 50, yLabelsSpace: options.yLabelsSpace || 50, drawYLines: options.drawYLines || true, drawXLines: options.drawXLines || false, yLabelDigits: options.yLabelDigits || 2, lineCount: options.lineCount || 8, barChartOptions: __assign(__assign({}, options.barChartOptions), { serieMargin: ((_a = options.barChartOptions) === null || _a === void 0 ? void 0 : _a.serieMargin) || 5, stepPadding: ((_b = options.barChartOptions) === null || _b === void 0 ? void 0 : _b.stepPadding) || 15 }) });
        this.longestSerieLength = this.calculateLongestSerie();
        this.highestValue = this.calculateLHighestValue();
        this.canvasElement = document.createElement('canvas');
        this.renderingContext = this.canvasElement.getContext('2d');
        this.calculateLHighestValue();
        this.calculateTopValue();
        this.calculateLineCount();
    }
    CanvasChart.prototype.calculateLongestSerie = function () {
        return Math.max.apply(Math, Object.values(this.series).map(function (currentSerie) { return currentSerie.length; }));
    };
    CanvasChart.prototype.calculateLHighestValue = function () {
        return Math.max.apply(Math, Object.values(this.series).map(function (currentSerie) {
            return Math.max.apply(Math, currentSerie);
        }));
    };
    CanvasChart.prototype.calculateTopValue = function () {
        if (this.options.lineSpace) {
            var topValue = this.highestValue % this.options.lineSpace === 0
                ? this.highestValue
                : this.highestValue +
                    (this.options.lineSpace -
                        (this.highestValue % this.options.lineSpace));
            this.topValue = topValue;
        }
        else {
            var mul_1 = 1;
            var steps = [1, 2.5, 5, 7.5, 10];
            var highs = steps.map(function (s) { return s * Math.pow(10, mul_1); });
            var expectedLineSpace = this.highestValue / this.options.lineCount;
            while (expectedLineSpace > Math.max.apply(Math, highs)) {
                mul_1++;
                highs = steps.map(function (s) { return s * Math.pow(10, mul_1); });
            }
            while (expectedLineSpace < Math.min.apply(Math, highs)) {
                mul_1++;
                highs = steps.map(function (s) { return s / Math.pow(10, mul_1); });
            }
            var divider = closestNumber(expectedLineSpace, highs);
            this.options.lineSpace = divider;
            this.topValue = divider * this.options.lineCount;
        }
    };
    CanvasChart.prototype.calculateLineCount = function () {
        var topValueDigits = String(this.topValue).length;
        this.yAxisScale = 1 / Math.pow(10, (topValueDigits - this.options.yLabelDigits));
        this.lineCount = this.topValue / this.options.lineSpace;
    };
    CanvasChart.prototype.initializeDimensions = function () {
        this.canvasElement.width = this.options.width;
        this.canvasElement.height = this.options.height;
        this.yStep =
            (this.options.height -
                2 * this.options.padding -
                this.options.legendSpace) /
                this.lineCount;
        this.xStep =
            (this.options.width -
                2 * this.options.padding -
                this.options.yLabelsSpace) /
                this.longestSerieLength;
    };
    CanvasChart.prototype.offsetPoint = function (point, xOffset, yOffset) {
        return [point[0] + xOffset, point[1] + yOffset];
    };
    CanvasChart.prototype.mapValueToY = function (value) {
        var gridHeight = this.yLines[this.yLines.length - 1][0][1] - this.yLines[0][0][1];
        var topValue = Number(this.yLabels[0]);
        var actualSpaceYSize = gridHeight * ((topValue - value * this.yAxisScale) / topValue);
        return this.options.padding + actualSpaceYSize;
    };
    CanvasChart.prototype.mapStepToX = function (step) {
        return (step * this.xStep +
            this.options.yLabelsSpace +
            this.options.padding +
            this.xStep / 2);
    };
    CanvasChart.prototype.drawRectangle = function (rectangle, color) {
        var _a;
        if (color === void 0) { color = 'black'; }
        this.renderingContext.fillStyle = color;
        (_a = this.renderingContext).fillRect.apply(_a, __spreadArray(__spreadArray([], rectangle[0], false), rectangle[1], false));
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
    CanvasChart.prototype.drawYLines = function () {
        var _this = this;
        this.yLines = Array.from({ length: this.lineCount + 1 }, function (_, i) { return i; }).map(function (index) {
            var line = [
                [
                    _this.options.padding + _this.options.yLabelsSpace,
                    _this.options.padding + index * _this.yStep,
                ],
                [
                    _this.options.width - _this.options.padding,
                    _this.options.padding + index * _this.yStep,
                ],
            ];
            if (index === 0 || _this.options.drawYLines)
                _this.drawLine(line, 'gray', 0.5);
            return line;
        });
    };
    CanvasChart.prototype.drawYLabels = function () {
        var _this = this;
        var highestValueCustomDigits = Number(String(this.topValue).slice(0, this.options.yLabelDigits));
        var actualLineSpace = this.options.lineSpace * this.yAxisScale;
        var next = highestValueCustomDigits;
        var yLabels = [];
        if (next % actualLineSpace !== 0) {
            next = next + actualLineSpace;
        }
        while (next >= 0) {
            yLabels.push(next);
            next = next - actualLineSpace;
        }
        var sup = this.yAxisScale !== 1
            ? '*10' +
                num2sup(String(Math.log10(1 / this.yAxisScale) === 1
                    ? ''
                    : Math.log10(1 / this.yAxisScale)))
            : '';
        this.yLabels = yLabels;
        this.yLines.forEach(function (line, index) {
            _this.drawText(String(yLabels[index] + (yLabels[index] !== 0 ? sup : '')), _this.offsetPoint(line[0], -10, 0));
        });
    };
    CanvasChart.prototype.drawXLines = function () {
        var _this = this;
        this.xLines = Array.from({ length: this.longestSerieLength }, function (_, i) { return i; }).map(function (index) {
            var line = [
                [
                    _this.options.padding + _this.options.yLabelsSpace + index * _this.xStep,
                    _this.options.padding,
                ],
                [
                    _this.options.padding + _this.options.yLabelsSpace + index * _this.xStep,
                    _this.options.height - _this.options.padding - _this.options.legendSpace,
                ],
            ];
            if (_this.options.drawXLines)
                _this.drawLine(line, 'silver', 0);
            return line;
        });
    };
    CanvasChart.prototype.drawXLabels = function () {
        var _this = this;
        this.xLabels.forEach(function (label, step) {
            _this.drawText(label, [
                _this.mapStepToX(step),
                _this.options.padding + (_this.yLines.length - 1) * _this.yStep + 5,
            ], 'black', 12, 'center', 'top');
        });
    };
    CanvasChart.prototype.drawSeriesLineChart = function () {
        var _this = this;
        Object.values(this.series).forEach(function (serie, serieIndex) {
            var line = serie.map(function (value, pointIndex) {
                return [_this.mapStepToX(pointIndex), _this.mapValueToY(value)];
            });
            _this.drawLine(line, _this.colors[serieIndex] || 'black');
        });
    };
    CanvasChart.prototype.calculateLegendWidth = function (iconWidth, iconMargin, xMargin) {
        this.renderingContext.font = "12px Arial";
        var labels = Object.keys(this.series);
        return (this.renderingContext.measureText(labels.join('')).width +
            labels.length * (xMargin * 2 + iconMargin + iconWidth));
    };
    CanvasChart.prototype.drawLegendLineChart = function () {
        var _this = this;
        var _a = [30, 5, 20], iconWidth = _a[0], iconMargin = _a[1], xMargin = _a[2];
        var legendWidth = this.calculateLegendWidth(iconWidth, iconMargin, xMargin);
        var legendPointer = (this.options.width -
            this.options.yLabelsSpace -
            this.options.padding -
            legendWidth) /
            2 +
            xMargin +
            this.options.yLabelsSpace +
            this.options.padding;
        var labels = Object.keys(this.series);
        var legendY = this.options.height - 15;
        labels.forEach(function (label, index) {
            _this.drawLine([
                [legendPointer, legendY],
                [legendPointer + iconWidth, legendY],
            ], _this.colors[index]);
            legendPointer += iconWidth + iconMargin;
            _this.drawText(label, [legendPointer, legendY], 'black', 12, 'start', 'middle');
            legendPointer += _this.renderingContext.measureText(label).width + xMargin;
        });
    };
    CanvasChart.prototype.drawLegendBarChart = function () {
        var _this = this;
        var _a = [12, 5, 20], iconWidth = _a[0], iconMargin = _a[1], xMargin = _a[2];
        var legendWidth = this.calculateLegendWidth(iconWidth, iconMargin, xMargin);
        var legendPointer = (this.options.width -
            this.options.yLabelsSpace -
            this.options.padding -
            legendWidth) /
            2 +
            xMargin +
            this.options.yLabelsSpace +
            this.options.padding;
        var labels = Object.keys(this.series);
        var legendY = this.options.height - 15;
        labels.forEach(function (label, index) {
            _this.drawRectangle([
                [legendPointer, legendY],
                [iconWidth, 12],
            ], _this.colors[index]);
            legendPointer += iconWidth + iconMargin;
            _this.drawText(label, [legendPointer, legendY], 'black', 12, 'start', 'top');
            legendPointer += _this.renderingContext.measureText(label).width + xMargin;
        });
    };
    CanvasChart.prototype.drawSeriesBarChart = function () {
        var _this = this;
        var seriesCount = Object.values(this.series).length;
        var stepWidth = this.xStep - 2 * this.options.barChartOptions.stepPadding;
        var barWidth = (stepWidth -
            (seriesCount - 1) * this.options.barChartOptions.serieMargin) /
            seriesCount;
        var barOffset = barWidth + this.options.barChartOptions.serieMargin;
        var xOffsetNumber = (-1 * stepWidth) / 2;
        Object.values(this.series).forEach(function (serie, serieIndex) {
            serie.forEach(function (value, pointIndex) {
                _this.drawRectangle([
                    [
                        _this.mapStepToX(pointIndex) +
                            xOffsetNumber +
                            barOffset * serieIndex,
                        _this.mapValueToY(value),
                    ],
                    [
                        barWidth,
                        _this.yLines[_this.yLines.length - 1][0][1] -
                            _this.mapValueToY(value),
                    ],
                ], _this.colors[serieIndex]);
            });
        });
    };
    CanvasChart.prototype.render = function (canvasContainerId, type) {
        this.canvasContainer = document.getElementById(canvasContainerId);
        if (!this.canvasContainer) {
            console.log('A container element with the ID you specified was not found.');
            return;
        }
        this.initializeDimensions();
        this.drawYLines();
        this.drawXLines();
        this.drawYLabels();
        this.drawXLabels();
        switch (type) {
            case 'bar':
                this.drawSeriesBarChart();
                this.drawLegendBarChart();
                break;
            case 'line':
                this.drawSeriesLineChart();
                this.drawLegendLineChart();
                break;
            default:
                break;
        }
        this.rendered = true;
        this.canvasContainer.innerHTML = '';
        this.canvasContainer.appendChild(this.canvasElement);
    };
    return CanvasChart;
}());
export default CanvasChart;
