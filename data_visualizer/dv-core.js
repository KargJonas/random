// DataVisualizer v0.2 - Jonas Karg - 15.03.2018

// Some variables
var startTime = new Date(),
    dvElems = [],
    dvTypes = [],
    border = 20;

// Start the lib (automatically called on init)
function start() {
    colorBuffer = document.createElement("div");
    colorBuffer.style.visibility = "hidden";
    getElems();
    createInstances();
    cnvSetup();
    draw();
    console.warn("Done.  ( " + (new Date() - startTime) + "ms )");
}

// Update data & canvasas
function update() {
    startTime = new Date()
    updateData();
    draw();
    console.warn("Done.  ( " + (new Date() - startTime) + "ms )");
}

// Get all elements with a dv-attribute
function getElems() {
    allElems = document.getElementsByTagName("*");
    for (var i = 0; i < allElems.length; i++) {
        if (allElems[i].getAttribute("dv") !== null) {
            dvElems.push(allElems[i]);
        }
    }
    allElems = null;
}

// Create elements according to specifyed dv-type (first attrib-element)
function createInstances() {
    for (i = 0; i < dvElems.length; i++) {
        attribs = getAttribData(i);

        // Get type (graph, piechart, ...)
        if (attribs[0].replace("type:", "") == "graph") {
            createType("graph", attribs, dvElems[i]);
        } else if(attribs[0].replace("type:", "") == "piechart") {
            createType("piechart", attribs, dvElems[i]);
        } else if(attribs[0].replace("type:", "") == "histogram") {
            createType("histogram", attribs, dvElems[i]);
        } else if(attribs[0].replace("type:", "") == "points") {
            createType("points", attribs, dvElems[i]);
        } else {
            err("Unknown dv-type:", dvTypes[i].type);
        }
    }
    attribs = null;
}

// Update data of dv-type
function updateData() {
    for (i = 0; i < dvElems.length; i++) {
        attribs = getAttribData(i);
        for (a = 0; a < attribs.length; a++) {
            if (attribs[a].startsWith("data:")) {
                dvTypes[i].data = getDataFromStr(attribs[a].replace("data:", ""));
            }
        }
    }
}

// Collect data of element and create a dv-instance according to it
function createType(type, attribs, parent) {
    dvTypes.push(new dvType(type));
    dvTypes[dvTypes.length - 1].parent = parent;
    for (b = 1; b < attribs.length; b++) {
        if (attribs[b].startsWith("width:")) {
            dvTypes[dvTypes.length - 1].width = parseInt(attribs[b].replace(/[^\d.-]/g, ""));
        } else if (attribs[b].startsWith("height:")) {
            dvTypes[dvTypes.length - 1].height = parseInt(attribs[b].replace(/[^\d.-]/g, ""));
        } else if (attribs[b].startsWith("color:")) {
            dvTypes[dvTypes.length - 1].color = attribs[b].replace("color:", "");
        } else if (attribs[b].startsWith("data:")) {
            dvTypes[dvTypes.length - 1].data = getDataFromStr(attribs[b].replace("data:", ""));
        } else {
            dvTypes[dvTypes.length - 1].additional.push(attribs[b]);
        }
    }

    if (dvTypes[dvTypes.length - 1].type != undefined && dvTypes[dvTypes.length - 1].width != undefined && dvTypes[dvTypes.length - 1].height != undefined && dvTypes[dvTypes.length - 1].color != undefined && dvTypes[dvTypes.length - 1].data != undefined) {
        return true;
    } else {
        err("Info missing! type, width, height, color and data required!  [" + attribs + "]");
        return false;
    }
}

// Set up canvasas // Run only once!
function cnvSetup() {
    for (i = 0; i < dvTypes.length; i++) {
        dvTypes[i].cnv = document.createElement("canvas");
        dvTypes[i].cnv.width = dvTypes[i].width;
        dvTypes[i].cnv.height = dvTypes[i].height;
        dvTypes[i].ctx = dvTypes[i].cnv.getContext("2d");
        dvTypes[i].ctx.translate(border, border);
        dvTypes[i].parent.appendChild(dvTypes[i].cnv);
    }
}

// Draw to canvasas
function draw() {
    for (i = 0; i < dvTypes.length; i++) {
        ctx = dvTypes[i].ctx;
        width = dvTypes[i].cnv.width - (2 *  border);
        height = dvTypes[i].cnv.height - (2 * border);
        max_x = dvTypes[i].data.length - 1;
        max_y = Math.max.apply(null, dvTypes[i].data);
        ctx.font = "14px Arial";

        ctx.clearRect(-border, -border, dvTypes[i].cnv.width, dvTypes[i].cnv.height);

        if (dvTypes[i].type == "graph") { // Graph
            draw_nodes = true;
            draw_text = true;
            step_size_x = width / max_x;
            step_size_y = height / max_y;
            node_color = dvTypes[i].color;

            if (dvTypes[i].additional != undefined) {
                for (a = 0; a < dvTypes[i].additional.length; a++) {
                    if (dvTypes[i].additional[a].startsWith("draw-nodes:")) {
                        if (dvTypes[i].additional[a].replace("draw-nodes:", "") == "false") {
                            draw_nodes = false;
                        } else if (dvTypes[i].additional[a].replace("draw-nodes:", "") == "true") {
                            draw_nodes = true;
                        } else {
                            err("Invalid draw-nodes vaule:", dvTypes[i].additional[a].replace("draw-nodes:", ""));
                        }
                    } else if (dvTypes[i].additional[a].startsWith("node-color:")) {
                        node_color = dvTypes[i].additional[a].replace("node-color:", "");
                    } else if(dvTypes[i].additional[a].startsWith("draw-text:")) {
                        if (dvTypes[i].additional[a].replace("draw-text:", "") == "false") {
                            draw_text = false;
                        } else if (dvTypes[i].additional[a].replace("draw-text:", "") == "true") {
                            draw_text = true;
                        } else {
                            err("Invalid draw-text vaule:", dvTypes[i].additional[a].replace("draw-text:", ""));
                        }
                    }
                }
            }

            ctx.lineCap="round";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.strokeStyle = "#bbb";
            ctx.rect(0, 0, width, height);
            if (step_size_x >= 10) {
                for (x = 0; x <= max_x; x++) {
                    ctx.moveTo(x * step_size_x, 0);
                    ctx.lineTo(x * step_size_x, height);
                }
            }
            if (step_size_y >= 10) {
                for (y = 0; y <= max_y; y++) {
                    ctx.moveTo(0, y * step_size_y);
                    ctx.lineTo(width, y * step_size_y);
                }
            }
            ctx.stroke();
            ctx.beginPath();
            ctx.strokeStyle = dvTypes[i].color;
            ctx.fillStyle = dvTypes[i].color;
            ctx.fill();
            ctx.lineWidth = 4;
            ctx.moveTo(0, height - (dvTypes[i].data[0] * step_size_y));
            for (x = 0; x <= max_x; x++) {
                ctx.lineTo(x * step_size_x, height - (dvTypes[i].data[x] * step_size_y));
            }
            ctx.stroke();
            ctx.beginPath();
            if (step_size_x >= 10 && draw_nodes) {
                ctx.fillStyle = node_color;
                ctx.strokeStyle = node_color;
                ctx.moveTo(0, height - (dvTypes[i].data[0] * step_size_y));
                for (x = 0; x <= max_x; x++) {
                    ctx.moveTo(x * step_size_x, height - (dvTypes[i].data[x] * step_size_y));
                    ctx.ellipse(x * step_size_x, height - (dvTypes[i].data[x] * step_size_y), 2, 2, 0, 0, 2 * Math.PI);
                }
            }
            if (draw_text) {
                if (step_size_x >= 10) {
                    for (x = 0; x <= max_x; x++) {
                        ctx.fillText(dvTypes[i].data[x], x *  step_size_x - ctx.measureText(dvTypes[i].data[x]).width / 2, height - (dvTypes[i].data[x] * step_size_y) - 8);
                    }
                }
                if (step_size_x >= 20) {
                    for (x = 0; x <= max_x; x++) {
                        ctx.fillText(x + 1, x * step_size_x, height + border / 2 + 6);
                    }
                }
            }
            ctx.stroke();
            draw_nodes = null;
            node_color = null;
            step_size_x = null;
            step_size_y = null;
            draw_text = null;
        } else if (dvTypes[i].type == "histogram") { // Histogram
            draw_text = true;
            step_size_x = width / (max_x + 1);
            step_size_y = (height - 20) / max_y;
            fill_color = "#fff";
            if (dvTypes[i].additional != undefined) {
                for (a = 0; a < dvTypes[i].additional.length; a++) {
                    if (dvTypes[i].additional[a].startsWith("draw-text:")) {
                        if (dvTypes[i].additional[a].replace("draw-text:", "") == "false") {
                            draw_text = false;
                        } else if (dvTypes[i].additional[a].replace("draw-text:", "") == "true") {
                            draw_text = true;
                        } else {
                            err("Invalid draw-text vaule:", dvTypes[i].additional[a].replace("draw-text:", ""));
                        }
                    } else if (dvTypes[i].additional[a].startsWith("fill-color:")) {
                        fill_color = dvTypes[i].additional[a].replace("fill-color:", "");
                    }
                }
            }
            sum = dvTypes[i].data.reduce(function(a, b) { return parseFloat(a) + parseFloat(b); }, 0);
            current = 0;
            smallest = Math.min(width, height) - border;

            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.strokeStyle = "#bbb";
            ctx.rect(0, 0, width, height);
            ctx.stroke();

            ctx.beginPath();
            ctx.lineWidth = 4;
            ctx.strokeStyle = dvTypes[i].color;
            ctx.fillStyle = fill_color;
            for (a = 0; a < dvTypes[i].data.length; a++) {
                ctx.rect(a * step_size_x, height, step_size_x, -dvTypes[i].data[a] * step_size_y);
            }

            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = "#000";
            if (draw_text) {
                if (step_size_x >= 10) {
                    for (x = 0; x <= max_x; x++) {
                        ctx.fillText(dvTypes[i].data[x], x *  step_size_x, height - (dvTypes[i].data[x] * step_size_y) - 6);
                    }
                }
                if (step_size_x >= 20) {
                    for (x = 0; x <= max_x; x++) {
                        ctx.fillText(x + 1, x * step_size_x, height + border / 2 + 6);
                    }
                }
            }

            step_size_x = null;
            step_size_y = null;
            draw_text = null;
            fill_color = null;
        } else if (dvTypes[i].type == "piechart") { // Piechart
            draw_text = true;
            min_size = false;
            draw_border = true;
            fill_color = "#fff";
            if (dvTypes[i].additional != undefined) {
                for (a = 0; a < dvTypes[i].additional.length; a++) {
                    if (dvTypes[i].additional[a].startsWith("draw-text:")) {
                        if (dvTypes[i].additional[a].replace("draw-text:", "") == "false") {
                            draw_text = false;
                        } else if (dvTypes[i].additional[a].replace("draw-text:", "") == "true") {
                            draw_text = true;
                        } else {
                            err("Invalid draw-text vaule:", dvTypes[i].additional[a].replace("draw-text:", ""));
                        }
                    } else if (dvTypes[i].additional[a].startsWith("fill-color:")) {
                        fill_color = dvTypes[i].additional[a].replace("fill-color:", "");
                    } else if (dvTypes[i].additional[a].startsWith("min-size:")) {
                        if (dvTypes[i].additional[a].replace("min-size:", "") == "false") {
                            min_size = false;
                        } else if (dvTypes[i].additional[a].replace("min-size:", "") == "true") {
                            min_size = true;
                        } else {
                            err("Invalid min-size vaule:", dvTypes[i].additional[a].replace("min-size:", ""));
                        }
                    } else if (dvTypes[i].additional[a].startsWith("draw-boder:")) {
                        if (dvTypes[i].additional[a].replace("draw-boder:", "") == "false") {
                            draw_border = false;
                        } else if (dvTypes[i].additional[a].replace("draw-boder:", "") == "true") {
                            draw_border = true;
                        } else {
                            err("Invalid draw-boder vaule:", dvTypes[i].additional[a].replace("draw-boder:", ""));
                        }
                    }
                }
            }
            sum = dvTypes[i].data.reduce(function(a, b) { return parseFloat(a) + parseFloat(b); }, 0);
            sorted = dvTypes[i].data.slice().sort(function(a, b) { return a - b; }).reverse();
            current = 0;
            smallest = Math.min(width, height) - border;

            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.strokeStyle = "#bbb";
            ctx.rect(0, 0, width, height);
            ctx.stroke();

            ctx.beginPath();
            ctx.lineCap="round";
            ctx.lineWidth = 4;
            ctx.strokeStyle = dvTypes[i].color;
            ctx.fillStyle = fill_color;
            for (a = 0; a < dvTypes[i].data.length; a++) {
                current += Math.PI * 2 / sum * sorted[a];
                ctx.arc(width / 2, height / 2, smallest / 2, 0, current);
                ctx.lineTo(width / 2, height / 2);
            }
            ctx.fill();
            ctx.stroke();
            if (draw_text) {
                current = 0;
                ctx.beginPath();
                ctx.fillStyle = "#000";
                for (a = 0; a < dvTypes[i].data.length; a++) {
                    current += (Math.PI * 2 / sum * sorted[a]);
                    if (min_size) {
                        if (Math.PI * 2 / sum * sorted[a] > 0.17) {
                            ctx.fillText(sorted[a], (Math.cos(current - (Math.PI * 2 / sum * sorted[a] / 2)) * smallest / 3) + width / 2, (Math.sin(current - (Math.PI * 2 / sum * sorted[a] / 2)) * smallest / 3) + height / 2);
                        }
                    } else {
                        ctx.fillText(sorted[a], (Math.cos(current - (Math.PI * 2 / sum * sorted[a] / 2)) * smallest / 3) + width / 2, (Math.sin(current - (Math.PI * 2 / sum * sorted[a] / 2)) * smallest / 3) + height / 2);
                    }
                }
                ctx.stroke();
            }
        } else if (dvTypes[i].type == "points") { // "Pointio-gram"
            draw_text = true;
            point_size = 5;
            step_size_x = width / max_x;
            step_size_y = height / max_y;

            if (dvTypes[i].additional != undefined) {
                for (a = 0; a < dvTypes[i].additional.length; a++) {
                    if (dvTypes[i].additional[a].startsWith("draw-text:")) {
                        if (dvTypes[i].additional[a].replace("draw-text:", "") == "false") {
                            draw_text = false;
                        } else if (dvTypes[i].additional[a].replace("draw-text:", "") == "true") {
                            draw_text = true;
                        } else {
                            err("Invalid draw-text vaule:", dvTypes[i].additional[a].replace("draw-text:", ""));
                        }
                    } else if (dvTypes[i].additional[a].startsWith("point-size:")) {
                        point_size = parseInt(dvTypes[i].additional[a].replace("point-size:", ""));
                    }
                }
            }
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.strokeStyle = "#bbb";
            ctx.rect(0, 0, width, height);
            if (step_size_x >= 10) {
                for (x = 0; x <= max_x; x++) {
                    ctx.moveTo(x * step_size_x, 0);
                    ctx.lineTo(x * step_size_x, height);
                }
            }
            if (step_size_y >= 10) {
                for (y = 0; y <= max_y; y++) {
                    ctx.moveTo(0, y * step_size_y);
                    ctx.lineTo(width, y * step_size_y);
                }
            }
            ctx.stroke();
            ctx.beginPath();
            ctx.fillStyle = dvTypes[i].color;
            ctx.moveTo(0, height - (dvTypes[i].data[0] * step_size_y));
            for (x = 0; x <= max_x; x++) {
                ctx.beginPath();
                ctx.moveTo(x * step_size_x, height - (dvTypes[i].data[x] * step_size_y));
                ctx.ellipse(x * step_size_x, height - (dvTypes[i].data[x] * step_size_y), point_size, point_size, 0, 0, 2 * Math.PI);
                ctx.fill();
            }
            ctx.beginPath();
            ctx.fillStyle = "#000";
            if (draw_text) {
                if (step_size_x >= 10) {
                    offset = -8;
                    if (point_size > 5) {
                        offset = 0;
                    }
                    for (x = 0; x <= max_x; x++) {
                        ctx.fillText(dvTypes[i].data[x], x *  step_size_x - ctx.measureText(dvTypes[i].data[x]).width / 2, height - (dvTypes[i].data[x] * step_size_y) + offset);
                    }
                }
                if (step_size_x >= 20) {
                    for (x = 0; x <= max_x; x++) {
                        ctx.fillText(x + 1, x * step_size_x, height + border / 2 + 6);
                    }
                }
            }
            ctx.stroke();
            point_size = null;
            step_size_x = null;
            step_size_y = null;
            draw_text = null;
        }
    }
    ctx = null;
    width = null;
    height = null;
    max_x = null;
    max_y = null;
}

// Return a array from a sring that represents a js variable
function getDataFromStr(inputStr) {
    if ((inputStr.startsWith("[") && inputStr.endsWith("]")) || (inputStr.startsWith("{") && inputStr.endsWith("}"))) {
        return inputStr.replace("[", "").replace("]", "").replace("{", "").replace("}", "").split(",");
    } else {
        return window[inputStr];
    }
}

// Get all elements in the dv-attribute as array
function getAttribData(i) {
    return dvElems[i].getAttribute("dv").toLowerCase().split(" ");
}

// Throw an error
function err(_error) {
    console.error("ERROR: " + _error);
}

// The template for any visualization
function dvType(type) {
    // Essential
    this.type = type;
    this.width;
    this.height;
    this.color;
    this.parent;
    this.data = [];

    // Additional data
    this.additional = [];

    // Automatic
    this.cnv;
    this.ctx;
}

// Starting the lib when page has loaded.
window.onload = start();