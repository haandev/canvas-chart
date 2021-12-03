import CanvasChart from './src/CanvasChart/index.js';
var canvas = new CanvasChart({
    options: {
        lines: 5,
        width: 500,
        height: 200,
        type: 'line',
    },
    series: {
        price: [10, 20, 5, 30, 50],
        cost: [10, 50, 1, 4, 70],
    },
});
canvas.render('chart-container');
