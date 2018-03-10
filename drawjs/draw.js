// Jonas Karg 04.01.2017
// Syntax inspired by p5.js

var startTim,
    autoRes = false;

function start() {
    startTime = new Date();
    if (typeof setup == "function") {
        console.log("setup() detected");
        setup();
        if (typeof draw == "function") { 
            console.log("draw() detected");
            setInterval(draw, 1);
        }
    }
}

function line(x1, y1, x2, y2, size, color) {
    cnv.beginPath();
    cnv.lineCap = "round";
    cnv.moveTo(x1, y1);
    cnv.lineTo(x2, y2);
    cnv.lineWidth = size;
    cnv.strokeStyle = color;
    cnv.stroke();
}

function point(x, y, size, color) {
    cnv.beginPath();
    cnv.moveTo(x, y);
    cnv.fillStyle = color;
    if (Math.floor(size) == 1) {
        cnv.rect(x, y, 1, 1);
    }
    else {
        cnv.arc(x, y, size, 0, 2 * Math.PI, false);
    }
    cnv.strokeStyle = color;
    cnv.fillStyle = color;
    cnv.fill();
    cnv.stroke();
}

function sinCol(input, sat) {
    r = Math.round(255 - Math.abs(Math.sin(input / 4000.0)) * sat);
    g = Math.round(255 - Math.abs(Math.sin(input / 4000.0 + 45)) * sat);
    b = Math.round(255 - Math.abs(Math.sin(input / 4000.0 + 90)) * sat);
    return "rgb(" + [r,g,b].join(", ") + ")";
    // return[r, g, b];
}

function millis() {
    now = new Date();
    return now - startTime;
}

function background(color) {
    cnv.fillRect(0, 0, cnv.width, cnv.height);
    cnv.fillStyle(color);
    cnv.fill();
}

function fullScreen() {
    elem.width = innerWidth;
    elem.height = innerHeight;
}

function setSize(x, y) {
    elem.width = x;
    elem.height = y;
}

function autoResize(input) {
    autoRes = input;
}

window.onresize = function (event) {
    if (autoRes) {
        elem.width = x;
        elem.height = y;
    }
}

function stroke(r, g, b) {
    return "rgb(" + [r,g,b].join(", ") + ")";
}