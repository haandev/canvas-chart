import CanvasChart from './src/CanvasChart/index.js';
var canvas = new CanvasChart({
    options: {
        width: 700,
        height: 300,
    },
    series: {
        s1: [3, 34, 21, 4],
        s2: [23, 4, 7, 15],
        s3: [12, 9, 5, 23],
    },
    xLabels: ['d1', 'd2', 'd3', 'd4'],
});
canvas.render('chart-container');
