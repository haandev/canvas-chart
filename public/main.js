import CanvasChart from './src/CanvasChart/index.js';
var canvas = new CanvasChart({
    options: {
        width: 700,
        height: 300,
        lineSpace: 100,
        drawXLines: true
    },
    series: {
        s1: [0, 720, 210, 40],
        s2: [230, 40, 70, 150],
        s3: [120, 90, 50, 230],
    },
    colors: ["red", "green", "blue"],
    xLabels: ['d1', 'd2', 'd3', 'd4'],
});
canvas.render('chart-container');
