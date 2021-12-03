const express = require("express");

const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.static('public'))
app.listen(8081)
console.log(
    `\nWelcome to CanvasChart assignment demonstration` +
    `\nRunning on environment: 8081`+
    `\nClick to go: http://localhost:8081`
);