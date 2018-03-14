// Data visualizer by Jonas Karg 13.03.2018
var startTime = new Date(),
    dvElems = [],
    graphs = [],
    cnvs = [], ctxs = [];

function start() {
    allElems = document.getElementsByTagName('*');
    for (var i = 0; i < allElems.length; i++) {
        if (allElems[i].getAttribute("dv") !== null) {
            dvElems.push(allElems[i]);
            attribs = dvElems[dvElems.length - 1].getAttribute("dv").split(" ");

            if (attribs.includes("graph")) {
                graphs[graphs.length] = new Graph();
                graphs[graphs.length - 1].parent = allElems[i]
                for (a = 0; a < attribs.length; a++) {
                    if (attribs[a].toLowerCase().startsWith("width:")) {
                        if (/^\d+$/.test(attribs[a].toLowerCase().replace("width:", ""))) {
                            graphs[graphs.length - 1].width = parseInt(attribs[a].toLowerCase().replace("width:", ""));
                        } else {
                            console.error("ERROR: Invalid width: ", attribs[a]);
                        }
                    } else if (attribs[a].toLowerCase().startsWith("height:")) {
                        if (/^\d+$/.test(attribs[a].toLowerCase().replace("height:", ""))) {
                            graphs[graphs.length - 1].height = parseInt(attribs[a].toLowerCase().replace("height:", ""));
                        } else {
                            console.error("ERROR: Invalid height: ", attribs[a]);
                        }
                    } else if (attribs[a].toLowerCase().startsWith("color:")) {
                        graphs[graphs.length - 1].color = attribs[a].toLowerCase().replace("color:", "");
                    } else if (attribs[a].toLowerCase().startsWith("data:")) {
                        if ((attribs[a].toLowerCase().replace("data:", "").startsWith("[") && attribs[a].toLowerCase().replace("data:", "").endsWith("]")) || (attribs[a].toLowerCase().replace("data:", "").startsWith("{") && attribs[a].toLowerCase().replace("data:", "").endsWith("}"))) {
                            graphs[graphs.length - 1].data = attribs[a].toLowerCase().replace("data:", "").replace("[", "").replace("]", "").replace("{", "").replace("}", "").split(",");
                        } else {
                            graphs[graphs.length - 1].data = window[attribs[a].toLowerCase().replace("data:", "")];
                        }
                    } else if (attribs[a].toLowerCase().startsWith("draw-nodes:")) {
                        if (attribs[a].toLowerCase().replace("draw-nodes:", "") == "false") {
                            graphs[graphs.length - 1].draw_nodes = false;
                        } else if (attribs[a].toLowerCase().replace("draw-nodes:", "") == "true") {
                            graphs[graphs.length - 1].draw_nodes = true;
                        } else {
                            console.error("ERROR: Invalid draw-nodes value:", attribs[a].toLowerCase().replace("draw-nodes:", ""), "Only \"true\" or \"false\"");
                        }
                    } else if (attribs[a].toLowerCase().startsWith("node-color:")) {
                        graphs[graphs.length - 1].node_color = attribs[a].toLowerCase().replace("node-color:", "");
                    } else if (attribs[a].toLowerCase().startsWith("axis-labeling:")) {
                        if (attribs[a].toLowerCase().replace("axis-labeling:", "") == "false") {
                            graphs[graphs.length - 1].axis_labeling = false;
                        } else if (attribs[a].toLowerCase().replace("axis-labeling:", "") == "true") {
                            graphs[graphs.length - 1].axis_labeling = true;
                        } else {
                            console.error("ERROR: Invalid axis-labeling value:", attribs[a].toLowerCase().replace("axis-labeling:", ""), "Only \"true\" or \"false\"");
                        }
                    }else if (attribs[a].toLowerCase().startsWith("node-color:")) {
                        graphs[graphs.length - 1].node_color = attribs[a].toLowerCase().replace("node-color:", "");
                    }
                }

                if (graphs[graphs.length - 1].width == undefined) {
                    console.error("ERROR: Missing attribute \"width\"");
                }
                if (graphs[graphs.length - 1].height == undefined) {
                    console.error("ERROR: Missing attribute \"height\"");
                }
                if (graphs[graphs.length - 1].color == undefined) {
                    console.error("ERROR: Missing attribute \"color\"");
                }
            }
        }
    }
    console.warn("INFO: Done parsing dv inputs.  ( " + (Date.now() - startTime) + "ms )");
    for (var i = 0; i < graphs.length; i++) {
        cnvs[i] = document.createElement("canvas");
        // cnvs[i].style.cssText = "width:" + graphs[i].width + "px;height:" + graphs[i].height + "px;border:solid;";
        cnvs[i].setAttribute("width", graphs[i].width);
        cnvs[i].setAttribute("height", graphs[i].height);
        ctxs[i] = cnvs[i].getContext("2d");
        graphs[i].parent.appendChild(cnvs[i]);
    }
    console.warn("INFO: Done setting up elements.  ( " + (Date.now() - startTime) + "ms )");
    for (var i = 0; i < graphs.length; i++) {
        drawGraph(i);
    }
    console.warn("INFO: Done drawing to elements.  ( " + (Date.now() - startTime) + "ms )");
}

function update() {

}

function drawGraph(i) {
    if (graphs[i].data != undefined) {
        var ctx = ctxs[i],
            width = cnvs[i].width - 20,
            height = cnvs[i].height - 20,
            max_x = graphs[i].data.length - 1,
            max_y = Math.max(...graphs[i].data),
            step_size_x = width / max_x,
            step_size_y = height / max_y;

        ctx.clearRect(0, 0, width, height);
        ctx.lineCap="round";
        ctx.translate(10, 10);
        ctx.lineWidth = 1;
        ctx.translate(0.5, 0.5);

        // Background lines
        ctx.beginPath();
        ctx.strokeStyle = "#ddd";
        ctx.rect(0, 0, width, height);
        if (step_size_x >= 10) {
            for (x = 0; x <= max_x; x++) {
                ctx.moveTo(x * step_size_x, 0);
                ctx.lineTo(x * step_size_x, height);
            }
        }
        if (step_size_y >= 10) {
            for (x = 0; x <= max_y; x++) {
                ctx.moveTo(0, x * step_size_y);
                ctx.lineTo(width, x * step_size_y);
            }
        }
        ctx.stroke();

        // Graph
        ctx.beginPath();
        ctx.strokeStyle = graphs[i].color;
        ctx.fillStyle = graphs[i].color;
        ctx.fill();
        ctx.lineWidth = 4;
        ctx.moveTo(0, height - (graphs[i].data[0] * step_size_y));
        for (x = 0; x <= max_x; x++) {
            ctx.lineTo(x * step_size_x, height - (graphs[i].data[x] * step_size_y));
        }
        ctx.stroke();
        ctx.beginPath();
        if (step_size_x >= 10 && step_size_x >= 6 && graphs[i].draw_nodes) {
            if (graphs[i].node_color != undefined) {
                ctx.fillStyle = graphs[i].node_color;
                ctx.strokeStyle = graphs[i].node_color;
            }
            ctx.moveTo(0, height - (graphs[i].data[0] * step_size_y));
            for (x = 0; x <= max_x; x++) {
                ctx.moveTo(x * step_size_x, height - (graphs[i].data[x] * step_size_y));
                ctx.ellipse(x * step_size_x, height - (graphs[i].data[x] * step_size_y), 2, 2, 0, 0, 2 * Math.PI);
            }
        }
        ctx.stroke();
        
        // Axis Labeling
        if (graphs[i].axis_labeling) {
            
        }
    } else {
        console.error("ERROR: No data given or invalid data: " + graphs[i].parent);
    }
}

function Graph() {
    this.parent;
    this.width;
    this.height;
    this.color;
    this.data;
    this.node_color;
    this.draw_nodes = true;
    this.axis_labeling = true;
}

start();